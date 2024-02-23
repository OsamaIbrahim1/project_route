import { Schema, model } from "mongoose";

const jobSchema = new Schema({
  jobTitle: { type: String, min: 10, max: 50, required: true },
  jobLocation: {
    type: String,
    enum: ["onsite", "remotely", "hybrid"],
    default: "remotely",
    required: true,
  },
  workingTime: {
    type: String,
    enum: ["part-time", "full-time"],
    default: "part-time",
    required: true,
  },
  seniorityLevel: {
    type: String,
    enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
    default: "Junior",
    required: true,
  },
  jobDescription: { type: String, min: 20, required: true },
  technicalSkills: [{ type: String, required: true }],
  softSkills: [{ type: String, required: true }],
  addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default model("Job", jobSchema);
