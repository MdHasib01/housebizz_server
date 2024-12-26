import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
    apartmentType: {
      type: String,
      enum: ["house", "shop", "office", "apartment", "villa"],
    },
    propertyStatus: { type: String, enum: ["rent", "sale", "sold"] },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);
propertySchema.plugin(mongooseAggregatePaginate);
export const Property = mongoose.model("Property", propertySchema);
