import mongoose, { Document, Schema, Types } from 'mongoose';
import { Certificate } from './certificates.model';


export interface CoachData extends Document {
  specialization: Types.ObjectId[];
  title: string;
  about: string;
  rating: number;
  certificates: Types.ObjectId[]; // reference to Certificate[]
  workingDays: string[]; // ['Monday', 'Wednesday']
}

const CoachEmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
});


const CoachSchema = new mongoose.Schema<CoachData>({
  specialization: [{ type: Schema.Types.ObjectId, ref: 'WorkoutOption' }],
  title: String,
  about: String,
  rating: { type: Number, default: 0 },
  certificates: [{ type: Schema.Types.ObjectId, ref: 'Certificate' }],
  workingDays: [String],
})


export const CoachModel = mongoose.model('CoachEmail', CoachEmailSchema);
export const CoachDataModel = mongoose.model<CoachData>('CoachDetails', CoachSchema);