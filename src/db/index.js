import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import app from "../app.js";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGOBD_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });
    console.log("MongoDB connected!");
  } catch (error) {
    console.log("MongoDB connection failed! ", error);
    process.exit(1);
  }
};

export default connectDB;
