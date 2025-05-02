// import { Request, Response } from 'express';
// import Course from '../models/Course';

// export const createCourse = async (req: Request, res: Response) => {
//   const { goalId, name } = req.body;
//   const course = await Course.create({ goalId, name });
//   res.status(201).json(course);
// };

// export const getCoursesByGoal = async (req: Request, res: Response) => {
//   const { goalId } = req.params;
//   const courses = await Course.find({ goalId });
//   res.json(courses);
// };

import { Request, Response } from "express";
import mongoose from "mongoose";
import Course from "../models/Course";

interface CreateCourseRequest {
  goalId: string;
  name: string;
}

interface GetCoursesByGoalParams {
  goalId: string;
}

export const createCourse = async (
  req: Request<{}, {}, CreateCourseRequest>,
  res: Response
): Promise<void> => {
  try {
    const { goalId, name } = req.body;

    // Validate input
    if (!goalId || !name) {
      res
        .status(400)
        .json({ message: "Missing required fields: goalId and name" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(goalId)) {
      res.status(400).json({ message: "Invalid goalId format" });
      return;
    }

    if (typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({ message: "Name must be a non-empty string" });
      return;
    }

    const course = await Course.create({
      goalId: new mongoose.Types.ObjectId(goalId),
      name: name.trim(),
    });

    res.status(201).json(course);
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error.code === 11000) {
      // Duplicate key error
      res
        .status(409)
        .json({ message: "Course with this name already exists for the goal" });
      return;
    }
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const getCoursesByGoal = async (
  req: Request<GetCoursesByGoalParams>,
  res: Response
): Promise<void> => {
  try {
    const { goalId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(goalId)) {
      res.status(400).json({ message: "Invalid goalId format" });
      return;
    }

    const courses = await Course.find({
      goalId: new mongoose.Types.ObjectId(goalId),
    });

    if (courses.length === 0) {
      res.status(404).json({ message: "No courses found for this goal" });
      return;
    }

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};


export const getAllCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const courses = await Course.find().populate("goalId", "name");

    if (courses.length === 0) {
      res.status(404).json({ message: "No courses found " });
      return;
    }

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};