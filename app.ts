import express, { Application,NextFunction, Request, Response } from 'express';
import cors from 'cors';


import authRoutes from './routes/authRoutes';
import adminroutes from './routes/adminRoutes';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    origin: ["https://chinta-acdemy-frontend-whhp.vercel.app","http://localhost:3000"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminroutes);


export default app;