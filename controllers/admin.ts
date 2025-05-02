import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Admin, { IAdmin } from "../models/Admin";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import { IUser } from "../models/User";
import ErrorHandler from "../utils/ErrorHnadler";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
}

interface AdminRegistrationBody {
  name: string;
  email: string;
  password: string;
  role: string;
}
export const registrationAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
      return next(new ErrorHandler("Email already exist", 400));
    }

    const admin: AdminRegistrationBody = {
      name: name,
      email: email,
      password: password,
      role: role,
    };

    const newUser = await Admin.create(admin);

    res.status(201).send({admin: admin, message: "Admin created successfully"});

  } catch (err: any) {
    return next(new ErrorHandler(err.message, 400));
  }
};

export const adminlogin = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const { email, password } = req.body as IRegistrationBody;

    const admin = await Admin.findOne({ email, role: "admin" }) as IAdmin;

    if (!admin) {
    //   return next(new ErrorHandler("You are not Admin", 401));
     res.status(401).json({ message: "Admin not exist" });
     return ;
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
    //   return next(new ErrorHandler("Invalid credentials", 401));
       res.status(401).json({ message: "Invalid Password" });
       return;
    }

    const token = generateToken(admin._id.toString(), admin.role)
    
    res
      .cookie("adminToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({
        success: true,
        message: "Admin logged in successfully",
        admin:admin,
        token: token,
      });
  } catch (err: any) {
    return next(new ErrorHandler(err.message, 400));
  }
};

interface AuthRequest extends Request {
 
  admin?: IAdmin
}

export const getAdmin = async(req: AuthRequest, res: Response, next: NextFunction):Promise<void>=> {
  try{
    
    const admin = await Admin.findById(req?.admin?.id).select("-password") as IAdmin;
    if(!admin) {
      // return next(new ErrorHandler("Admin not found", 404));
      res.status(400).json({ message: "Admin not found" });
      return
    }
    if(admin.role !== "admin") {
      // return next(new ErrorHandler("You are not Admin", 401));
      res.status(401).json({ message: "You are not Admin" });
      return
    }
    res.status(200).json({success: true, admin: admin});
  }
  catch(err: any) {
    return next(new ErrorHandler(err.message, 400));
  }
}
