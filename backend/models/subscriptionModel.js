import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  subscriptionId: {
    type: String,
    required: true,
    unique: true,
  },
  trialStartDate: {
    type: Date,
    required: true,
  },
  trialEndDate: {
    type: Date,
    required: true,
  },
  currentPeriodStart: {
    type: Date,
    required: true,
  },
  currentPeriodEnd: {
    type: Date,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  price: {
    type: Number, 
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
