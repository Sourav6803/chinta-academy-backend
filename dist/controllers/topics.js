"use strict";
// import { Request, Response } from 'express';
// import Topic from '../models/Topic';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTopics = exports.getTopicsByCourse = exports.createTopic = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Topic_1 = __importDefault(require("../models/Topic"));
const createTopic = async (req, res) => {
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
        if (!mongoose_1.default.Types.ObjectId.isValid(courseId)) {
            res.status(400).json({ message: 'Invalid courseId format' });
            return;
        }
        if (name.trim().length > 100) {
            res.status(400).json({ message: 'Topic name cannot exceed 100 characters' });
            return;
        }
        // Check for duplicate topic name in the same course
        const existingTopic = await Topic_1.default.findOne({
            courseId,
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } // Case-insensitive match
        });
        if (existingTopic) {
            res.status(409).json({
                message: 'Topic with this name already exists in the course'
            });
            return;
        }
        const topic = await Topic_1.default.create({
            courseId: new mongoose_1.default.Types.ObjectId(courseId),
            name: name.trim()
        });
        res.status(201).json({
            id: topic._id,
            courseId: topic.courseId,
            name: topic.name,
        });
        return;
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            res.status(400).json({
                message: 'Validation error',
                errors: error.errors
            });
            return;
        }
        console.error('Error creating topic:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
exports.createTopic = createTopic;
const getTopicsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(courseId)) {
            res.status(400).json({ message: 'Invalid courseId format' });
            return;
        }
        const topics = await Topic_1.default.find({
            courseId: new mongoose_1.default.Types.ObjectId(courseId)
        })
            .select('_id name ')
            .sort({ createdAt: 1 })
            .lean();
        res.json({
            courseId,
            count: topics.length,
            topics
        });
    }
    catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
exports.getTopicsByCourse = getTopicsByCourse;
const getAllTopics = async (req, res) => {
    try {
        const topics = await Topic_1.default.find().populate('courseId', 'name')
            // .select('_id name courseId')
            .sort({ createdAt: 1 })
            .lean();
        if (topics.length === 0) {
            res.status(200).json({ message: 'No topics found', data: [] });
            return;
        }
        res.json({
            count: topics.length,
            data: topics
        });
    }
    catch (error) {
        console.error('Error fetching all topics:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
exports.getAllTopics = getAllTopics;
