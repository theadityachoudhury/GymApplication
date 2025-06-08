import mongoose, { Document, Schema, Types } from "mongoose";

export interface WorkoutOptionDocument extends Document {
  name: string;
  coachesId?: Types.ObjectId[];
}

const WorkoutOptionsSchema = new Schema<WorkoutOptionDocument>({
  name: { type: String, required: true },
  coachesId: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export const WorkoutOption = mongoose.model<WorkoutOptionDocument>('WorkoutOption', WorkoutOptionsSchema);
