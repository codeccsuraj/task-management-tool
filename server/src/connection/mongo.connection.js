import mongoose from "mongoose";
import { config } from "../config/var.config.js";

const connectDB = async () => {
    try {
        await mongoose.connect(config.MongoURI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

export default connectDB;