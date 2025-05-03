import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import { IUser } from "../models/User";
import ErrorHandler from "../utils/ErrorHnadler";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  role: string;
}
export const registrationUser = async (
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

    const user: IRegistrationBody = {
      name: name,
      email: email,
      password: password,
      role: role,
    };

    const newUser = await User.create(user);

    res.status(201).send({user: newUser, message: "User created successfully"});

  } catch (err: any) {
    return next(new ErrorHandler(err.message, 400));
  }
};

interface ILoginrequest {
  email: string;
  password: string;
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
  const { email, password } = req.body as ILoginrequest;

  const user = await User.findOne({ email }) as IUser;
  if (!user)  res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)  res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user._id.toString(), user.role);

  console.log("Token", token);

  
   res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : undefined,
      domain: 'https://chinta-acdemy-frontend-whhp.vercel.app',
      path: "/", 
    })

    .json({ success: true, user: user, token:token });
};


export const allUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const users = await User.find({role: 'user'}).select("-password -__v").sort({ createdAt: -1 });
    res.status(200).json(users);
  }
  catch(err: any) {
    return next(new ErrorHandler(err.message, 400));
  }
}