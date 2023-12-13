import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import AgentCompany from "../models/agentCompanyModel.js";
const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.userId).select("-password");
      const agentCompany = await AgentCompany.findOne({ email: user.email });
      // Check if the associated agent company is marked as fraudulent
      if (agentCompany && !agentCompany.isGood) {
        res.status(401);
        throw new Error("This is a fraud company. Log in is not allowed.");
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized,invalid token");
    }
  } else {
    res.status(401);
    throw new Error("not authorized,no token");
  }
});
const checkUserRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("Not authorized to access this resource");
    }
    next();
  };
};
export { protect, checkUserRole };
