import mongoose, { Schema, Document } from 'mongoose';
export interface CertificateDocument extends Document {
  name: string;
  issuer: string;
  issueDate: Date;
  fileUrl: string;
}

const CertificateSchema = new Schema<CertificateDocument>({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: Date },
  fileUrl: { type: String },
});

export const Certificate = mongoose.model<CertificateDocument>('Certificate', CertificateSchema);