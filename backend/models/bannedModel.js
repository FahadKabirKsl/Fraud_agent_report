import mongoose from "mongoose";

const bannedSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  number: {
    type: Number,
    required: false,
    unique: true,
    sparse: true,
  },
  nid: {
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
  isAgent: {
    type: Boolean,
    required: true,
  },
  isCompany: {
    type: Boolean,
    required: true,
  },
});

const Banned = mongoose.model("Banned", bannedSchema);

export default Banned;
