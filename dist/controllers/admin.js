"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdmin = exports.adminlogin = exports.registrationAdmin = void 0;
const User_1 = __importDefault(require("../models/User"));
const Admin_1 = __importDefault(require("../models/Admin"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("../utils/generateToken");
const ErrorHnadler_1 = __importDefault(require("../utils/ErrorHnadler"));
const registrationAdmin = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const isEmailExist = await User_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHnadler_1.default("Email already exist", 400));
        }
        const admin = {
            name: name,
            email: email,
            password: password,
            role: role,
        };
        const newUser = await Admin_1.default.create(admin);
        res.status(201).send({ admin: admin, message: "Admin created successfully" });
    }
    catch (err) {
        return next(new ErrorHnadler_1.default(err.message, 400));
    }
};
exports.registrationAdmin = registrationAdmin;
const adminlogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin_1.default.findOne({ email, role: "admin" });
        if (!admin) {
            //   return next(new ErrorHandler("You are not Admin", 401));
            res.status(401).json({ message: "Admin not exist" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch) {
            //   return next(new ErrorHandler("Invalid credentials", 401));
            res.status(401).json({ message: "Invalid Password" });
            return;
        }
        const token = (0, generateToken_1.generateToken)(admin._id.toString(), admin.role);
        console.log("token", token);
        res
            .cookie("adminToken", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            sameSite: "none",
            secure: true,
            domain: "https://chinta-acdemy-frontend-whhp.vercel.app",
            path: "/"
        })
            .status(200)
            .json({
            success: true,
            message: "Admin logged in successfully",
            admin: admin,
            token: token,
        });
    }
    catch (err) {
        return next(new ErrorHnadler_1.default(err.message, 400));
    }
};
exports.adminlogin = adminlogin;
const getAdmin = async (req, res, next) => {
    try {
        const admin = await Admin_1.default.findById(req?.admin?.id).select("-password");
        if (!admin) {
            // return next(new ErrorHandler("Admin not found", 404));
            res.status(400).json({ message: "Admin not found" });
            return;
        }
        if (admin.role !== "admin") {
            // return next(new ErrorHandler("You are not Admin", 401));
            res.status(401).json({ message: "You are not Admin" });
            return;
        }
        res.status(200).json({ success: true, admin: admin });
    }
    catch (err) {
        return next(new ErrorHnadler_1.default(err.message, 400));
    }
};
exports.getAdmin = getAdmin;
