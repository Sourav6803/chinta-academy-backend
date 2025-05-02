import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface ICourse extends Document {
  goalId: Types.ObjectId ;  
  name: string;
}

const courseSchema:Schema = new mongoose.Schema({
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  name: { type: String, required: true },
});

const Course:Model<ICourse> = mongoose.model<ICourse>('Course', courseSchema)

export default Course