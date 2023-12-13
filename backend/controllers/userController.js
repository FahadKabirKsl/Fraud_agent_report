import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import AgentCompany from "../models/agentCompanyModel.js";
import Banned from "../models/bannedModel.js";
import { stripe } from "../config/db.js";
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    // Check if the associated agent company is marked as fraudulent
    const agentCompany = await AgentCompany.findOne({ email: user.email });

    if (agentCompany && !agentCompany.isGood) {
      res.status(401);
      throw new Error("This is a fraud company. Log in is not allowed.");
    }
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
const createStripeCustomer = async () => {
  try {
    const customer = await stripe.customers.create({});
    return customer.id;
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw error;
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  const bannedUser = await Banned.findOne({ email: email });
  if (bannedUser) {
    res.status(403);
    throw new Error("Banned user cannot be registered again");
  }
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  let stripeCustomerId;
  if (role !== "admin") {
    stripeCustomerId = await createStripeCustomer();
  }
  const user = await User.create({
    name,
    email,
    password,
    role,
    stripeCustomerId,
  });
  if (role === "agentCompany") {
    const agentCompany = new AgentCompany({
      name,
      email,
      password,
      role,
    });
    await agentCompany.save();
  }
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      stripeCustomerId: user.stripeCustomerId,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "User logged out" });
});
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  };
  res.status(200).json(user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { email, number, cid } = req.body;
  const userWithSameEmail = await User.findOne({ email });
  const userWithSameNumber = await User.findOne({ number });
  const userWithSameCid = await User.findOne({ cid });
  if (
    userWithSameEmail &&
    userWithSameEmail._id.toString() !== user._id.toString()
  ) {
    res.status(400);
    throw new Error("Email is already in use");
  }

  if (
    userWithSameNumber &&
    userWithSameNumber._id.toString() !== user._id.toString()
  ) {
    res.status(400);
    throw new Error("Number is already in use");
  }

  if (
    userWithSameCid &&
    userWithSameCid._id.toString() !== user._id.toString()
  ) {
    res.status(400);
    throw new Error("CID is already in use");
  }

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.number = req.body.number || user.number;
    user.cid = req.body.cid || user.cid;
    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.file) {
      user.avatar = `/uploads/${req.file.originalname}`;
    }

    const updatedUser = await user.save();

    if (user.role === "agentCompany") {
      const agentCompany = await AgentCompany.findOne({ email: user.email });
      if (agentCompany) {
        agentCompany.name = user.name;
        agentCompany.email = user.email;
        agentCompany.number = user.number;
        agentCompany.cid = user.cid;
        agentCompany.avatar = user.avatar;

        await agentCompany.save();
      }
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      number: updatedUser.number,
      cid: updatedUser.cid,
      avatar: updatedUser.avatar,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
