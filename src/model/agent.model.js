import mongoose, { Schema } from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    yearsOfExperience: Number,
    officeAddress: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    verificationStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "verified", "rejected"],
    },
  },
  { timestamps: true }
);

export const Agent = mongoose.model("Agent", agentSchema);
