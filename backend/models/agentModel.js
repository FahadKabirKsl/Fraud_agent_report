import mongoose from "mongoose";
const agentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  agentCompany: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgentCompany",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  nid: {
    type: Number,
    required: true,
    unique: true,
    sparse: true,
  },
  number: {
    type: Number,
    required: true,
    unique: true,
    sparse: true,
  },
  address: {
    type: String,
    required: true,
  },

  agentAvatar: {
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

const Agent = mongoose.model("Agent", agentSchema);

export default Agent;
