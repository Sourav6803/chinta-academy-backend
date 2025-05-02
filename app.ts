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


// app.use(cors({
//     origin: function (origin, callback) {
//       const allowedOrigins = [
//         'https://chinta-acdemy-frontend-whhp.vercel.app',
//         'http://localhost:3000',
//       ];
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//   }));

// CORS configuration
// const corsOptions = {
//     origin: [
//       'https://chinta-acdemy-frontend-whhp.vercel.app',
//       'http://localhost:3000',
//     ],
//     credentials: true,
//     optionsSuccessStatus: 200 // For legacy browser support
//   };
 

app.use((req, res, next): any=> {
    const allowedOrigins = [
      'https://chinta-acdemy-frontend-whhp.vercel.app',
      'http://localhost:3000',
    ];
    
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    next();
  });

   
  // Apply CORS middleware
//   app.use(cors(corsOptions));
  
  // Handle preflight requests for all routes
//   app.options('*', cors(corsOptions));
  
  // Add this middleware to handle preflight requests
  app.options('*', cors());
  

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminroutes);


export default app;