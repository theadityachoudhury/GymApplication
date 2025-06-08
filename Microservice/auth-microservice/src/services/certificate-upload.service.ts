// certificate-upload.service.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { UserRole } from '../models/user.model';
import logger from '../config/logger';
import HttpError from '../utils/http-error';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';

config();

interface PresignedUrlInfo {
  fileName: string;
  uploadUrl: string;
  fileUrl: string;
}

export class CertificateUploadService {
  private bucketName: string;
  private folderPath: string;
  private roleArn: string;
  private region: string;
  private urlExpirationSeconds: number;

  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME || 'enery-x-hosting';
    this.folderPath = process.env.CERTIFICATE_UPLOAD_FOLDER || 'certificate-upload';
    this.roleArn = process.env.AWS_ROLE_ARN || 'arn:aws:iam::864942469729:role/org/DeveloperAccessRoleTeam2';
    this.region = process.env.AWS_REGION || 'eu-west-2';
    this.urlExpirationSeconds = 3600; // 1 hour

    // Check for required environment variables
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_SESSION_TOKEN) {
      logger.error('Missing AWS credentials');
      throw new Error('Missing AWS credentials');
    }
    if (!this.bucketName || !this.folderPath || !this.roleArn) {
      throw new Error('Missing required environment variables for S3 upload');
    }
  }

  private async assumeRole() {
    const stsClient = new STSClient({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        sessionToken: process.env.AWS_SESSION_TOKEN
      }
    });

    const command = new AssumeRoleCommand({
      RoleArn: this.roleArn,
      RoleSessionName: `CertificateUploader-${uuidv4()}`
    });

    const response = await stsClient.send(command);
    if (!response.Credentials) {
      throw new HttpError(500, 'Failed to assume IAM role');
    }

    return {
      accessKeyId: response.Credentials.AccessKeyId!,
      secretAccessKey: response.Credentials.SecretAccessKey!,
      sessionToken: response.Credentials.SessionToken!
    };
  }

  async generateUploadUrls(
    fileNames: string[],
    fileTypes: string[],
    certificateType: string,
    userRole: UserRole,
    userId: string
  ): Promise<PresignedUrlInfo[]> {
    try {
      logger.info('Generating pre-signed URLs for certificate upload', { 
        userRole, 
        userId, 
        fileCount: fileNames.length,
        certificateType
      });

      const credentials = await this.assumeRole();

      const s3Client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          sessionToken: credentials.sessionToken
        }
      });

      const presignedUrls: PresignedUrlInfo[] = [];

      for (let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i];
        const fileType = fileTypes[i];
        
        // Sanitize file name to avoid S3 path issues
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
        
        // Generate a unique key for the file
        const key = `${this.folderPath}/${userRole}/${userId}/${uuidv4()}-${sanitizedFileName}`;
        
        // Create the command for generating a pre-signed URL
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          ContentType: fileType,
          ACL: 'private'
        });

        // Generate the pre-signed URL
        const uploadUrl = await getSignedUrl(s3Client, command, { 
          expiresIn: this.urlExpirationSeconds 
        });

        // The URL where the file will be accessible after upload
        const fileUrl = `https://${this.bucketName}.s3.amazonaws.com/${key}`;

        presignedUrls.push({
          fileName: sanitizedFileName,
          uploadUrl,
          fileUrl
        });
      }

      logger.info('Pre-signed URLs generated successfully', { 
        userId, 
        urlCount: presignedUrls.length 
      });

      return presignedUrls;
    } catch (error) {
      if (error instanceof HttpError) throw error;

      logger.error('Error generating pre-signed URLs', error as Error);
      throw new HttpError(500, 'Failed to generate upload URLs');
    }
  }
}