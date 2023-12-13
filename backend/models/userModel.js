import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
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
      required: true,
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
    isBanned: {
      type: Boolean,
      default: false,
    },
    stripeCustomerId: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;
