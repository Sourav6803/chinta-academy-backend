"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes = express_1.default.Router();
// authRoutes.post('/register', registrationUser);
// authRoutes.post('/login', login);
// authRoutes.get('/users', allUsers)
exports.default = authRoutes;
