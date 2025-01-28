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

agentSchema.pre("save", async function (next) {
  if (this.isModified("verificationStatus")) {
    try {
      const User = mongoose.model("User");

      if (this.verificationStatus === "verified") {
        await User.findByIdAndUpdate(this.userId, { role: "agent" });
      } else if (
        this.verificationStatus === "rejected" ||
        this.verificationStatus === "pending"
      ) {
        await User.findByIdAndUpdate(this.userId, { role: "user" });
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});
export const Agent = mongoose.model("Agent", agentSchema);
