import mongoose,{ Document, Schema, Model, Types }  from 'mongoose';

interface IAssignments extends Document{
    userId: Types.ObjectId;
    goalId: Types.ObjectId;
    courseId: Types.ObjectId;
    topicId: Types.ObjectId;
    createdAt: Date
}

const assignmentSchema: Schema = new mongoose.Schema({
  userId: { type: String, required: true }, // assuming user is external
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  createdAt: {type: Date, default: Date.now()}
});

const Assignment:Model<IAssignments> = mongoose.model<IAssignments>('Assignment', assignmentSchema)

export default Assignment