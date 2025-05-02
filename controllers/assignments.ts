// import { Request, Response } from 'express';
// import Assignment from '../models/Assignment';

// export const assignToUser = async (req: Request, res: Response) => {
//   const { userId, goalId, courseId, topicId } = req.body;
//   const assignment = await Assignment.create({ userId, goalId, courseId, topicId });
//   res.status(201).json(assignment);
// };

// export const getAssignmentsByUser = async (req: Request, res: Response) => {
//   const { userId } = req.params;
//   const assignments = await Assignment.find({ userId })
//     .populate('goalId')
//     .populate('courseId')
//     .populate('topicId');
//   res.json(assignments);
// };

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Assignment from '../models/Assignment';

interface AssignmentRequest {
  userId: string;
  goalId: string;
  courseId: string;
  topicId: string;
}

interface UserParams {
  userId: string;
}

export const assignToUser = async (req: Request<{}, {}, AssignmentRequest>, res: Response):Promise<void> => {
  try {
    const { userId, goalId, courseId, topicId } = req.body;

    // Validate all required fields
    if (!userId || !goalId || !courseId || !topicId) {
       res.status(400).json({
        message: 'All fields are required',
        missingFields: {
          ...(!userId && { userId: 'missing' }),
          ...(!goalId && { goalId: 'missing' }),
          ...(!courseId && { courseId: 'missing' }),
          ...(!topicId && { topicId: 'missing' })
        }
      });
      return
    }

    // Validate ObjectId formats
    const invalidIds = [];
    if (!mongoose.Types.ObjectId.isValid(userId)) invalidIds.push('userId');
    if (!mongoose.Types.ObjectId.isValid(goalId)) invalidIds.push('goalId');
    if (!mongoose.Types.ObjectId.isValid(courseId)) invalidIds.push('courseId');
    if (!mongoose.Types.ObjectId.isValid(topicId)) invalidIds.push('topicId');

    if (invalidIds.length > 0) {
       res.status(400).json({
        message: 'Invalid ID format',
        invalidFields: invalidIds
      });
      return
    }

    // Check for existing assignment to prevent duplicates
    const existingAssignment = await Assignment.findOne({
      userId,
      goalId,
      courseId,
      topicId
    });

    if (existingAssignment) {
       res.status(409).json({
        message: 'This assignment already exists'
      });
      return;
    }

    const assignment = await Assignment.create({
      userId: new mongoose.Types.ObjectId(userId),
      goalId: new mongoose.Types.ObjectId(goalId),
      courseId: new mongoose.Types.ObjectId(courseId),
      topicId: new mongoose.Types.ObjectId(topicId)
    });

     res.status(201).json({
      id: assignment._id,
      userId: assignment.userId,
      goalId: assignment.goalId,
      courseId: assignment.courseId,
      topicId: assignment.topicId,
      assignedAt: assignment.createdAt
    });
    return

  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
       res.status(400).json({
        message: 'Validation error',
        errors: error.message
      });
      return
    }
    console.error('Assignment creation error:', error);
     res.status(500).json({ message: 'Internal server error' });
     return
  }
};

export const getAssignmentsByUser = async (req: Request, res: Response):Promise<void> => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
       res.status(400).json({ message: 'Invalid user ID format' });
       return
    }

    const assignments = await Assignment.find({ 
      userId: new mongoose.Types.ObjectId(userId) 
    })
    .populate({
      path: 'goalId',
      select: 'name _id'
    })
    .populate({
      path: 'courseId',
      select: 'name _id'
    })
    .populate({
      path: 'topicId',
      select: 'name _id'
    })
    .select('_id goalId courseId topicId createdAt')
    .sort({ createdAt: -1 }) // Newest first
    .lean();

    if (assignments.length === 0) {
       res.status(200).json({
        message: 'No assignments found for this user',
        data: []
      });
      return
    }

     res.json({
      userId,
      count: assignments.length,
      assignments
    });
    return

  } catch (error) {
    console.error('Error fetching assignments:', error);
     res.status(500).json({ message: 'Internal server error' });
     return
  }
};


export const allAssignments = async (req: Request, res: Response):Promise<void> => {
  try {
    const assignments = await Assignment.find()
      .populate('userId', 'name email')
      .populate('goalId', 'name')
      .populate('courseId', 'name')
      .populate('topicId', 'name')
      .select('_id userId goalId courseId topicId createdAt')
      .sort({ createdAt: -1 }) // Newest first
      .lean();

    if (assignments.length === 0) {
       res.status(200).json({
        message: 'No assignments found',
        data: []
      });
      return
    }

     res.json({
      count: assignments.length,
      assignments
    });
    return

  } catch (error) {
    console.error('Error fetching all assignments:', error);
     res.status(500).json({ message: 'Internal server error' });
     return
  }
}
