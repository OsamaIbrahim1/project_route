import { Schema, model } from "mongoose";
const companySchema = new Schema(
  {
    companyName: { type: String, unique: true, required: true },
    description: { type: String, min: 20, required: true },
    industry: { type: String, required: true },
    address: { type: String, required: true },
    numberOfEmployees: { type: Number, min: 11, max: 20, required: true },
    companyEmail: { type: String, unique: true, required: true },
    companyHR: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model("Company", companySchema);
