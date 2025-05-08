"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "https://chinta-acdemy-frontend-whhp.vercel.app",
    credentials: true
}));
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
// app.use((req, res, next): any=> {
//     const allowedOrigins = [
//       'https://chinta-acdemy-frontend-whhp.vercel.app',
//       'http://localhost:3000',
//     ];
//     const origin = req.headers.origin;
//     if (origin && allowedOrigins.includes(origin)) {
//       res.setHeader('Access-Control-Allow-Origin', origin);
//     }
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     if (req.method === 'OPTIONS') {
//       return res.sendStatus(200);
//     }
//     next();
//   });
// Apply CORS middleware
//   app.use(cors(corsOptions));
// Handle preflight requests for all routes
//   app.options('*', cors(corsOptions));
// Add this middleware to handle preflight requests
app.options('*', (0, cors_1.default)({
    origin: "https://chinta-acdemy-frontend-whhp.vercel.app",
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
exports.default = app;
