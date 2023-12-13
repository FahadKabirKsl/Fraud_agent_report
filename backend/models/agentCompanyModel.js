import mongoose from "mongoose";
const agentCompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: [
      "admin",
      "msbCompany",
      "msbIndividual",
      "agentCompany",
    ],
    default: "admin",
  },
  password: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: false,
    unique: true,
    sparse: true,
  },

  cid: {
    type: Number,
    required: false,
    unique: true,
    sparse: true,
  },
  avatar: {
    type: String,
  },

  isGood: {
    type: Boolean,
    default: true,
  },
  incident: {
    type: String,
  },
  attemptFraud: { type: Boolean, default: false },
  attemptFraudIncident: { type: String },
  attemptFraudCount: {
    type: Number,
    default: 0,
  },
  attemptFraudDetails: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Change "User" to the actual user model
      },
      name: {
        type: String,
      },
      incident: {
        type: String,
      },
    },
  ],
  isBanned: {
    type: Boolean,
    default: false,
  },
});

const AgentCompany = mongoose.model("AgentCompany", agentCompanySchema);

export default AgentCompany;
