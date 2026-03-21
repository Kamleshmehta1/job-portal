import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
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

const Proposal = mongoose.model("Proposal", proposalSchema);
export default Proposal;
