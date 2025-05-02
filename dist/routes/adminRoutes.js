"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controllers/admin");
const goal_1 = require("../controllers/goal");
const auth_1 = require("../middleware/auth");
const course_1 = require("../controllers/course");
const topics_1 = require("../controllers/topics");
const assignments_1 = require("../controllers/assignments");
const adminroutes = express_1.default.Router();
adminroutes.post('/register', admin_1.registrationAdmin);
adminroutes.post('/login', admin_1.adminlogin);
adminroutes.get("/getAdmin", auth_1.isAdmin, admin_1.getAdmin);
// Goal
adminroutes.post('/goal', auth_1.isAdmin, goal_1.createGoal);
adminroutes.get('/goal', auth_1.isAdmin, goal_1.getGoals);
// Course
adminroutes.post('/course', auth_1.isAdmin, course_1.createCourse);
adminroutes.get('/course/:goalId', course_1.getCoursesByGoal);
adminroutes.get('/all-courses', course_1.getAllCourses);
// Topic
adminroutes.post('/topic', auth_1.isAdmin, topics_1.createTopic);
adminroutes.get('/topic/:courseId', topics_1.getTopicsByCourse);
adminroutes.get('/all-topics', topics_1.getAllTopics);
// // Assign
adminroutes.post('/assign', auth_1.isAdmin, assignments_1.assignToUser);
adminroutes.get('/assign/:userId', auth_1.isAdmin, assignments_1.getAssignmentsByUser);
adminroutes.get('/all-assignments', auth_1.isAdmin, assignments_1.allAssignments);
exports.default = adminroutes;
