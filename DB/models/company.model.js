// ! 1 - company.model : numberOfEmployees (type Number) , & i want it as a range (from , to) (-2)
// ? changes
import mongoose from "mongoose";
const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, unique: true, required: true },
    description: { type: String, min: 20, required: true },
    industry: { type: String, required: true },
    address: { type: String, required: true },
    numberOfEmployees: {
      from: { type: Number, required: true },
      to: { type: Number, required: true },
    },
    companyEmail: { type: String, unique: true, required: true },
    companyHR: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Company ||
  mongoose.model("Company", companySchema);
