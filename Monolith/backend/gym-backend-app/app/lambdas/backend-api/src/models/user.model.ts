import { UserPreferableActivity, UserTarget } from '@/schemas/auth.schemas';
import mongoose, { Document, Schema, Types } from 'mongoose';

export enum UserRole {
    Client = 'client',
    Coach = 'coach',
    Admin = 'admin'
}

export interface BaseUser extends Document {
    cognitoId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    gym: Types.ObjectId | null; // null for admin
    image: string;
}

export interface ClientUser extends BaseUser {
    clientId: Types.ObjectId | null;
}

export interface CoachUser extends BaseUser {
    coachId: Types.ObjectId | null;
}

export interface AdminUser extends BaseUser {
    adminId: Types.ObjectId | null;
}

const UserSchema: Schema = new Schema<BaseUser>(
    {
        cognitoId: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        role: {
            type: String,
            enum: UserRole,
            required: true,
            default: UserRole.Client
        },
        gym: { type: Schema.Types.ObjectId, ref: 'Gym', default: null },
        image: { type: String, default: '' },
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model<BaseUser>("User", UserSchema);

export const Client = User.discriminator<ClientUser>('Client', new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'ClientDetails' },
}));

export const Coach = User.discriminator<CoachUser>('Coach', new Schema({
    coachId: { type: Schema.Types.ObjectId, ref: 'CoachDetails' },

}));

export const Admin = User.discriminator<AdminUser>('Admin', new Schema({
    adminId: { type: Schema.Types.ObjectId, ref: 'AdminDetails' },
}));


UserSchema.index({ cognitoId: 1, _id: 1 })
UserSchema.index({ email: 1 });

