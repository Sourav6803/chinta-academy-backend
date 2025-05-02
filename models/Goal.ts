import mongoose, { Document, Schema, Model } from 'mongoose';

// 1. Interface for the Goal document
interface IGoal extends Document {
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const goalSchema: Schema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true 
});


const Goal: Model<IGoal> = mongoose.model<IGoal>('Goal', goalSchema);

export default Goal;