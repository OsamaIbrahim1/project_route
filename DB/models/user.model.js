import mongoose, { Schema, model } from "mongoose";
import { systemRole } from "../../src/utils/systemRoles.js";

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String },
    email: { type: String, unique: true, required: true },
    recoveryEmail: { type: String, required: true },
    password: { type: String, min: 6, max: 15, required: true },
    dateOfBirth: { type: Date, required: true },
    mobileNumber: { type: String, unique: true, required: true },
    role: {
      type: String,
      enum: [systemRole.USER, systemRole.HR],
      default: systemRole.USER,
      required: true,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
      required: true,
    },
    passwordResetOTP: {
      code: String,
      expiresAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
