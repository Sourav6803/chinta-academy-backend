import express from 'express';
import { login, registrationUser, allUsers } from '../controllers/user';

const authRoutes = express.Router();

authRoutes.post('/register', registrationUser);
authRoutes.post('/login', login);
authRoutes.get('/users', allUsers)


export default authRoutes;