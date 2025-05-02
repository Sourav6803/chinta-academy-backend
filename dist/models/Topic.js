"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const topicSchema = new mongoose_1.default.Schema({
    courseId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Course', required: true },
    name: { type: String, required: true },
});
const Topics = mongoose_1.default.model('Topic', topicSchema);
exports.default = Topics;
