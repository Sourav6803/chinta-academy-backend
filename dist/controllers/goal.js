"use strict";
// import { Request, Response } from 'express';
// import Goal from '../models/Goal';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoals = exports.createGoal = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Goal_1 = __importDefault(require("../models/Goal"));
const createGoal = async (req, res) => {
    try {
        const { name } = req.body;
        // Validate input
        if (!name?.trim()) {
            res.status(400).json({ message: "Name is required and cannot be empty" });
            return;
        }
        // Check for existing goal with same name
        const existingGoal = await Goal_1.default.findOne({ name: name.trim() });
        if (existingGoal) {
            res.status(409).json({ message: "Goal with this name already exists" });
            return;
        }
        const goal = await Goal_1.default.create({
            name: name.trim()
        });
        res.status(201).json({
            _id: goal._id,
            name: goal.name,
            createdAt: goal.createdAt
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            res.status(400).json({ message: error.message });
            return;
        }
        console.error('Error creating goal:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
exports.createGoal = createGoal;
const getGoals = async (_, res) => {
    try {
        const goals = await Goal_1.default.find().select('_id name createdAt').sort({ createdAt: -1 }).lean();
        if (goals.length === 0) {
            res.status(200).json({ message: "No goals found", data: [] });
            return;
        }
        res.json({
            count: goals.length,
            data: goals
        });
    }
    catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
exports.getGoals = getGoals;
