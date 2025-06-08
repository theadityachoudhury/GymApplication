import mongoose, { Document } from "mongoose";

export interface ClientData extends Document {
    target: string;
    preferredActivity: string;
}

const ClientSchema = new mongoose.Schema<ClientData>({
    target: { type: String, required: true },
    preferredActivity: { type: String, required: true },
});

export const ClientDataModel = mongoose.model<ClientData>('ClientDetails', ClientSchema);
