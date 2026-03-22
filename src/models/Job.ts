import mongoose, { Document, Schema, Types } from "mongoose";

export interface Budget {
  min: number;
  max: number;
}

export interface JobDocument extends Document {
  title: string;
  description: string;
  skillsRequired: string[];
  budget: Budget;
  deadline: Date;
  client: Types.ObjectId;
  status: "open" | "in-progress" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<JobDocument>(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    skillsRequired: [{ type: String }],

    budget: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "cancelled"],
      default: "open",
    },

    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Job = mongoose.model<JobDocument>("Job", jobSchema);
export default Job;
