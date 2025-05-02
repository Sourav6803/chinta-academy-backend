"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const emailRegxPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validator: function (value) {
            return emailRegxPattern.test(value);
        },
        message: "Enter a valid Email",
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcryptjs_1.default.hash(this.password, 10);
});
// export default mongoose.model:Model<IUser>("User", userSchema);
const userModel = mongoose_1.default.model("User", userSchema);
exports.default = userModel;
