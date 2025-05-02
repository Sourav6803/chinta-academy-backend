"use strict";
// import { Request, Response } from 'express';
// import Assignment from '../models/Assignment';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allAssignments = exports.getAssignmentsByUser = exports.assignToUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Assignment_1 = __importDefault(require("../models/Assignment"));
const assignToUser = async (req, res) => {
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
            return;
        }
        // Validate ObjectId formats
        const invalidIds = [];
        if (!mongoose_1.default.Types.ObjectId.isValid(userId))
            invalidIds.push('userId');
        if (!mongoose_1.default.Types.ObjectId.isValid(goalId))
            invalidIds.push('goalId');
        if (!mongoose_1.default.Types.ObjectId.isValid(courseId))
            invalidIds.push('courseId');
        if (!mongoose_1.default.Types.ObjectId.isValid(topicId))
            invalidIds.push('topicId');
        if (invalidIds.length > 0) {
            res.status(400).json({
                message: 'Invalid ID format',
                invalidFields: invalidIds
            });
            return;
        }
        // Check for existing assignment to prevent duplicates
        const existingAssignment = await Assignment_1.default.findOne({
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
        const assignment = await Assignment_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            goalId: new mongoose_1.default.Types.ObjectId(goalId),
            courseId: new mongoose_1.default.Types.ObjectId(courseId),
            topicId: new mongoose_1.default.Types.ObjectId(topicId)
        });
        res.status(201).json({
            id: assignment._id,
            userId: assignment.userId,
            goalId: assignment.goalId,
            courseId: assignment.courseId,
            topicId: assignment.topicId,
            assignedAt: assignment.createdAt
        });
        return;
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            res.status(400).json({
                message: 'Validation error',
                errors: error.message
            });
            return;
        }
        console.error('Assignment creation error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
exports.assignToUser = assignToUser;
const getAssignmentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID format' });
            return;
        }
        const assignments = await Assignment_1.default.find({
            userId: new mongoose_1.default.Types.ObjectId(userId)
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
            return;
        }
        res.json({
            userId,
            count: assignments.length,
            assignments
        });
        return;
    }
    catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
exports.getAssignmentsByUser = getAssignmentsByUser;
const allAssignments = async (req, res) => {
    try {
        const assignments = await Assignment_1.default.find()
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
            return;
        }
        res.json({
            count: assignments.length,
            assignments
        });
        return;
    }
    catch (error) {
        console.error('Error fetching all assignments:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
exports.allAssignments = allAssignments;
