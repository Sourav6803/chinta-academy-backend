"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUsers = exports.login = exports.registrationUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("../utils/generateToken");
const ErrorHnadler_1 = __importDefault(require("../utils/ErrorHnadler"));
const registrationUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const isEmailExist = await User_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHnadler_1.default("Email already exist", 400));
        }
        const user = {
            name: name,
            email: email,
            password: password,
            role: role,
        };
        const newUser = await User_1.default.create(user);
        res.status(201).send({ user: newUser, message: "User created successfully" });
    }
    catch (err) {
        return next(new ErrorHnadler_1.default(err.message, 400));
    }
};
exports.registrationUser = registrationUser;
const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user)
        res.status(401).json({ message: "Invalid credentials" });
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        res.status(401).json({ message: "Invalid credentials" });
    const token = (0, generateToken_1.generateToken)(user._id.toString(), user.role);
    console.log("Token", token);
    res
        .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : undefined,
        // domain: 'https://chinta-acdemy-frontend-whhp.vercel.app',
        path: "/",
    })
        .json({ success: true, user: user, token: token });
};
exports.login = login;
const allUsers = async (req, res, next) => {
    try {
        const users = await User_1.default.find({ role: 'user' }).select("-password -__v").sort({ createdAt: -1 });
        res.status(200).json(users);
    }
    catch (err) {
        return next(new ErrorHnadler_1.default(err.message, 400));
    }
};
exports.allUsers = allUsers;
