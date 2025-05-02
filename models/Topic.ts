import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface ITopics extends Document{
    courseId: Types.ObjectId,
    name: String
}

const topicSchema: Schema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  name: { type: String, required: true },
});

const Topics: Model<ITopics> = mongoose.model<ITopics>('Topic', topicSchema)

export default Topics