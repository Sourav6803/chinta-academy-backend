"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const isAuthenticated = (req, res, next) => {
    const { token } = req.cookies;
    if (!token)
        return res.status(401).json({ message: 'Not authenticated' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.isAuthenticated = isAuthenticated;
// export const authorizeRoles = (...roles: string[]) => {
//   return (req: AuthRequest, res: Response, next: NextFunction) => {
//     if (!roles.includes(req.user?.role)) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }
//     next();
//   };
// };
const isAdmin = async (req, res, next) => {
    try {
        const { adminToken } = req.cookies;
        if (!adminToken) {
            res.status(401).json({ message: 'Admin authentication required' });
            return;
        }
        // Verify and decode token
        const decoded = jsonwebtoken_1.default.verify(adminToken, process.env.JWT_SECRET_KEY || 'secret');
        // Find admin in database
        const admin = await Admin_1.default.findById(decoded.id);
        if (!admin) {
            res.status(401).json({ message: 'Admin account not found' });
            return;
        }
        // Check if user has admin role
        if (admin.role !== 'admin') {
            res.status(403).json({ message: 'Admin privileges required' });
            return;
        }
        // Attach admin to request object
        req.admin = admin;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ message: 'Admin session expired' });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid admin token' });
            return;
        }
        console.error('Admin authentication error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
exports.isAdmin = isAdmin;
