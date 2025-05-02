// import { Request, Response } from 'express';
// import Topic from '../models/Topic';

// export const createTopic = async (req: Request, res: Response) => {
//   const { courseId, name } = req.body;
//   const topic = await Topic.create({ courseId, name });
//   res.status(201).json(topic);
// };

// export const getTopicsByCourse = async (req: Request, res: Response) => {
//   const { courseId } = req.params;
//   const topics = await Topic.find({ courseId });
//   res.json(topics);
// };

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Topic from '../models/Topic';

interface CreateTopicRequest {
  courseId: string;
  name: string;
}

interface GetTopicsParams {
  courseId: string;
}

export const createTopic = async (req: Request<{}, {}, CreateTopicRequest>, res: Response):Promise<void> => {
  try {
    const { courseId, name } = req.body;

    // Input validation
    if (!courseId || !name?.trim()) {
       res.status(400).json({ 
        message: 'Both courseId and name are required',
        errors: {
          ...(!courseId && { courseId: 'Course ID is required' }),
          ...(!name?.trim() && { name: 'Topic name is required' })
        }
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
       res.status(400).json({ message: 'Invalid courseId format' });
       return
    }

    if (name.trim().length > 100) {
       res.status(400).json({ message: 'Topic name cannot exceed 100 characters' });
       return
    }

    // Check for duplicate topic name in the same course
    const existingTopic = await Topic.findOne({ 
      courseId, 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } // Case-insensitive match
    });

    if (existingTopic) {
       res.status(409).json({ 
        message: 'Topic with this name already exists in the course' 
      });
      return;
    }

    const topic = await Topic.create({ 
      courseId: new mongoose.Types.ObjectId(courseId),
      name: name.trim()
    });

     res.status(201).json({
      id: topic._id,
      courseId: topic.courseId,
      name: topic.name,
      
    });
    return;

  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
       res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
      return
    }
    console.error('Error creating topic:', error);
     res.status(500).json({ message: 'Internal server error' });
     return
  }
};

export const getTopicsByCourse = async (req: Request<GetTopicsParams>, res: Response):Promise<void> => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
       res.status(400).json({ message: 'Invalid courseId format' });
       return
    }

    const topics = await Topic.find({ 
      courseId: new mongoose.Types.ObjectId(courseId) 
    })
    .select('_id name ')
    .sort({ createdAt: 1 }) 
    .lean();

     res.json({
      courseId,
      count: topics.length,
      topics
    });

  } catch (error) {
    console.error('Error fetching topics:', error);
     res.status(500).json({ message: 'Internal server error' });
     return
  }
};

export const getAllTopics = async (req: Request, res: Response):Promise<void> => {
  try {
    const topics = await Topic.find().populate('courseId', 'name')
      // .select('_id name courseId')
      .sort({ createdAt: 1 })
      .lean();

    if (topics.length === 0) {
       res.status(200).json({ message: 'No topics found', data: [] });
       return
    }

     res.json({
      count: topics.length,
      data: topics
    });
    
  } catch (error) {
    console.error('Error fetching all topics:', error);
     res.status(500).json({ message: 'Internal server error' });
     return
  }
};



