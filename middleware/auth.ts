import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import Admin, { IAdmin } from '../models/Admin';

interface AuthRequest extends Request {
  user?: IUser;
  admin?: IAdmin
}

export const isAuthenticated = (req: AuthRequest, res: Response, next: NextFunction) => {
  const {token} = req.cookies;

  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as IUser;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// export const authorizeRoles = (...roles: string[]) => {
//   return (req: AuthRequest, res: Response, next: NextFunction) => {
//     if (!roles.includes(req.user?.role)) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }
//     next();
//   };
// };

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { adminToken } = req.cookies;

      
  
      if (!adminToken) {
         res.status(401).json({ message: 'Admin authentication required' });
         return;
      }
  
      // Verify and decode token
      const decoded = jwt.verify(adminToken, process.env.JWT_SECRET_KEY || 'secret') as { id: string };
  
      // Find admin in database
      const admin = await Admin.findById(decoded.id);
  
      if (!admin) {
         res.status(401).json({ message: 'Admin account not found' });
         return
      }
  
      // Check if user has admin role
      if (admin.role !== 'admin') {
         res.status(403).json({ message: 'Admin privileges required' });
         return
      }
  
      // Attach admin to request object
      req.admin = admin;
      next();
  
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
         res.status(401).json({ message: 'Admin session expired' });
         return
      }
      if (error instanceof jwt.JsonWebTokenError) {
         res.status(401).json({ message: 'Invalid admin token' });
         return
      }
      console.error('Admin authentication error:', error);
       res.status(500).json({ message: 'Internal server error' });
       return
    }
  };

