import mongoose from "mongoose";
import Stripe from "stripe";
import dontenv from "dotenv";
dontenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
export { connectDB, stripe };
