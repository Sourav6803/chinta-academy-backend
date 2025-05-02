import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const emailRegxPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validator: function (value: string) {
        return emailRegxPattern.test(value);
      },
      message: "Enter a valid Email",
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// export default mongoose.model:Model<IUser>("User", userSchema);
const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
