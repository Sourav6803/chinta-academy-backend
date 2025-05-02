"use strict";
// import { Request, Response } from 'express';
// import Course from '../models/Course';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCourses = exports.getCoursesByGoal = exports.createCourse = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Course_1 = __importDefault(require("../models/Course"));
const createCourse = async (req, res) => {
    try {
        const { goalId, name } = req.body;
        // Validate input
        if (!goalId || !name) {
            res
                .status(400)
                .json({ message: "Missing required fields: goalId and name" });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(goalId)) {
            res.status(400).json({ message: "Invalid goalId format" });
            return;
        }
        if (typeof name !== "string" || name.trim().length === 0) {
            res.status(400).json({ message: "Name must be a non-empty string" });
            return;
        }
        const course = await Course_1.default.create({
            goalId: new mongoose_1.default.Types.ObjectId(goalId),
            name: name.trim(),
        });
        res.status(201).json(course);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
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
exports.createCourse = createCourse;
const getCoursesByGoal = async (req, res) => {
    try {
        const { goalId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(goalId)) {
            res.status(400).json({ message: "Invalid goalId format" });
            return;
        }
        const courses = await Course_1.default.find({
            goalId: new mongoose_1.default.Types.ObjectId(goalId),
        });
        if (courses.length === 0) {
            res.status(404).json({ message: "No courses found for this goal" });
            return;
        }
        res.json(courses);
    }
    catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};
exports.getCoursesByGoal = getCoursesByGoal;
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course_1.default.find().populate("goalId", "name");
        if (courses.length === 0) {
            res.status(404).json({ message: "No courses found " });
            return;
        }
        res.json(courses);
    }
    catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};
exports.getAllCourses = getAllCourses;
