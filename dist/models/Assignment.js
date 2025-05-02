"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const assignmentSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true }, // assuming user is external
    goalId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Goal', required: true },
    courseId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Course', required: true },
    topicId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Topic', required: true },
    createdAt: { type: Date, default: Date.now() }
});
const Assignment = mongoose_1.default.model('Assignment', assignmentSchema);
exports.default = Assignment;
