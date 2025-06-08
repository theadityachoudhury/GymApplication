import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { UserRole } from '../models/user.model';
import logger from '../config/logger';
import HttpError from '../utils/http-error';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';

config();

export class ImageUploadService {
    private bucketName: string;
    private folderPath: string;
    private roleArn: string;
    private region: string;

    constructor() {
        this.bucketName = process.env.S3_BUCKET_NAME || 'enery-x-hosting';
        this.folderPath = process.env.IMAGE_UPLOAD_FOLDER || 'image-upload';
        this.roleArn = process.env.AWS_ROLE_ARN || 'arn:aws:iam::864942469729:role/org/DeveloperAccessRoleTeam2';
        this.region = process.env.AWS_REGION || 'eu-west-2';

        //check for keys, id and secrets
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
            RoleSessionName: `ImageUploader-${uuidv4()}`
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

    async uploadProfileImage(base64Image: string, userRole: UserRole, userId: string): Promise<string> {
        try {
            logger.info('Processing image upload', { userRole, userId });

            if (!this.isValidBase64Image(base64Image)) {
                logger.warn('Invalid base64 image format', { userId });
                throw new HttpError(400, 'Invalid image format. Please provide a valid base64 encoded image.');
            }

            const { imageBuffer, contentType, fileExtension } = this.parseBase64Image(base64Image);
            const key = `${this.folderPath}/${userRole}/${userId}/${uuidv4()}${fileExtension}`;

            const credentials = await this.assumeRole();

            const s3Client = new S3Client({
                region: this.region,
                credentials: {
                    accessKeyId: credentials.accessKeyId,
                    secretAccessKey: credentials.secretAccessKey,
                    sessionToken: credentials.sessionToken
                }
            });

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: imageBuffer,
                ContentType: contentType,
                ACL: 'private'
            });

            await s3Client.send(command);

            const imageUrl = `https://${this.bucketName}.s3.amazonaws.com/${key}`;
            logger.info('Image uploaded successfully', { userId, imageUrl });

            return imageUrl;
        } catch (error) {
            if (error instanceof HttpError) throw error;

            logger.error('Error uploading image', error as Error);
            throw new HttpError(500, 'Failed to upload image');
        }
    }

    private isValidBase64Image(base64String: string): boolean {
        const regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
        return regex.test(base64String);
    }

    private parseBase64Image(base64String: string): {
        imageBuffer: Buffer,
        contentType: string,
        fileExtension: string
    } {
        const matches = base64String.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
            throw new HttpError(400, 'Invalid base64 image format');
        }

        const imageType = matches[1];
        const base64Data = matches[2];
        const contentType = `image/${imageType}`;

        let fileExtension = '.jpg';
        switch (imageType.toLowerCase()) {
            case 'png':
                fileExtension = '.png';
                break;
            case 'gif':
                fileExtension = '.gif';
                break;
            case 'webp':
                fileExtension = '.webp';
                break;
            case 'jpeg':
            case 'jpg':
                fileExtension = '.jpg';
                break;
        }

        const imageBuffer = Buffer.from(base64Data, 'base64');

        return { imageBuffer, contentType, fileExtension };
    }
}