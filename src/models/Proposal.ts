import mongoose, { Document, Schema, Types } from "mongoose";

export interface ProposalDocument extends Document {
  job: Types.ObjectId;
  freelancer: Types.ObjectId;
  coverLetter: string;
  bidAmount: number;
  deliveryDays: number;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: Date;
  updatedAt: Date;
}

const proposalSchema = new Schema<ProposalDocument>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: {
      type: String,
      required: [true, "Cover letter is required"],
    },
    bidAmount: {
      type: Number,
      required: [true, "Bid amount is required"],
    },
    deliveryDays: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },
  },
  { timestamps: true },
);

proposalSchema.index({ job: 1, freelancer: 1 }, { unique: true });

const Proposal = mongoose.model<ProposalDocument>("Proposal", proposalSchema);

export default Proposal;
