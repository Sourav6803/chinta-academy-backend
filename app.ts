import express, { Application,NextFunction, Request, Response } from 'express';
import cors from 'cors';


import authRoutes from './routes/authRoutes';
import adminroutes from './routes/adminRoutes';
import cookieParser from 'cookie-parser';


const app = express();

// app.use(cors({
//     origin: ["https://chinta-acdemy-frontend-whhp.vercel.app","http://localhost:3000"],
//     credentials: true
// }));


app.use(cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        'https://chinta-acdemy-frontend-whhp.vercel.app',
        'http://localhost:3000',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));
  
  // Add this middleware to handle preflight requests
  app.options('*', cors());
  

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminroutes);


export default app;