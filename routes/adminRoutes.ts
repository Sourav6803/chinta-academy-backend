import express from 'express';
import {adminlogin, getAdmin, registrationAdmin } from '../controllers/admin';
import { createGoal, getGoals } from '../controllers/goal';
import {isAuthenticated, isAdmin } from '../middleware/auth';
import { createCourse, getCoursesByGoal, getAllCourses } from '../controllers/course';
import { createTopic, getTopicsByCourse, getAllTopics } from '../controllers/topics';
import { allAssignments, assignToUser, getAssignmentsByUser } from '../controllers/assignments';

const adminroutes = express.Router();


adminroutes.post('/register', registrationAdmin)
adminroutes.post('/login', adminlogin);
adminroutes.get("/getAdmin", isAdmin, getAdmin)

// Goal
adminroutes.post('/goal', isAdmin, createGoal);
adminroutes.get('/goal',isAdmin, getGoals);

// Course
adminroutes.post('/course', isAdmin, createCourse);
adminroutes.get('/course/:goalId',  getCoursesByGoal);
adminroutes.get('/all-courses', getAllCourses );

// Topic
adminroutes.post('/topic', isAdmin, createTopic);
adminroutes.get('/topic/:courseId', getTopicsByCourse);
adminroutes.get('/all-topics', getAllTopics);

// // Assign
adminroutes.post('/assign', isAdmin, assignToUser);
adminroutes.get('/assign/:userId', isAdmin, getAssignmentsByUser);
adminroutes.get('/all-assignments', isAdmin, allAssignments);

export default adminroutes;