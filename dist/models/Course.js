"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const courseSchema = new mongoose_1.default.Schema({
    goalId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Goal', required: true },
    name: { type: String, required: true },
});
const Course = mongoose_1.default.model('Course', courseSchema);
exports.default = Course;
