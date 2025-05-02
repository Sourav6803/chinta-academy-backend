// import { Request, Response } from 'express';
// import Goal from '../models/Goal';

// export const createGoal = async (req: Request, res: Response) => {
//   const { name } = req.body;
//   if(!name.trim()){
//     res.status(400).json({message: "Name is required"})
//   }
//   const goal = await Goal.create({ name });
//   res.status(201).json(goal);
// };

// export const getGoals = async (_: Request, res: Response) => {
//   const goals = await Goal.find();
//   res.json(goals);
// };



import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Goal from '../models/Goal';

interface CreateGoalRequest {
  name: string;
}

export const createGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    // Validate input
    if (!name?.trim()) {
       res.status(400).json({ message: "Name is required and cannot be empty" });
       return ;
    }

    // Check for existing goal with same name
    const existingGoal = await Goal.findOne({ name: name.trim() });
    if (existingGoal) {
       res.status(409).json({ message: "Goal with this name already exists" });
       return;
    }

    const goal = await Goal.create({ 
      name: name.trim() 
    });

     res.status(201).json({
      _id: goal._id,
      name: goal.name,
      createdAt: goal.createdAt
    });
    
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
       res.status(400).json({ message: error.message });
       return;
    }
    console.error('Error creating goal:', error);
     res.status(500).json({ message: 'Internal server error' });
     return
  }
};

export const getGoals = async (_: Request, res: Response): Promise<void> => {
  try {
    const goals = await Goal.find().select('_id name createdAt').sort({ createdAt: -1 }).lean();
    
    if (goals.length === 0) {
       res.status(200).json({ message: "No goals found", data: [] });
       return
    }

     res.json({
      count: goals.length,
      data: goals
    });
    
  } catch (error) {
    console.error('Error fetching goals:', error);
     res.status(500).json({ message: 'Internal server error' });
     return
  }
};