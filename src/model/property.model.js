import mongoose, { Schema } from "mongoose";

const propertySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    city: { type: String },
    divission: { type: String },
    price: { type: Number, required: true },
    image: { type: Array },
    size: { type: Number },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    garage: { type: Number },
    yearBuilt: { type: Number },
    appartmentType: {
      type: String,
      enum: ["house", "shop", "office", "apartment", "villa"],
    },
    porertyStatus: { type: String, enum: ["rent", "sale", "sold"] },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export const Property = mongoose.model("Property", propertySchema);
