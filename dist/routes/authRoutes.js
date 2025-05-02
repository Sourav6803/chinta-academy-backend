"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const authRoutes = express_1.default.Router();
authRoutes.post('/register', user_1.registrationUser);
authRoutes.post('/login', user_1.login);
authRoutes.get('/users', user_1.allUsers);
exports.default = authRoutes;
