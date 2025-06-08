import mongoose, { Document } from "mongoose";

export interface AdminData extends Document {
    phoneNumber: Number;
}

const AdminEmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
});

const AdminSchema = new mongoose.Schema<AdminData>({
    phoneNumber: { type: Number, required: true },
});

export const AdminEmailsDataModel = mongoose.model("AdminEmails",AdminEmailSchema)
export const AdminDataModel = mongoose.model<AdminData>('AdminDetails', AdminSchema);
