import asyncHandler from "express-async-handler";
import Agent from "../models/agentModel.js";
import AgentCompany from "../models/agentCompanyModel.js";
import Banned from "../models/bannedModel.js";
import User from "../models/userModel.js";
const addAgent = asyncHandler(async (req, res) => {
  const { name, email, nid, address, number } = req.body;
  const agentAvatar = `/uploads/${req.file.originalname}`;
  if (req.user.role !== "agentCompany") {
    res.status(401);
    throw new Error("Not authorized to add agents");
  }
  const bannedAgent = await Banned.findOne({
    $or: [
      { email: email, isAgent: true },
      { number: number, isAgent: true },
      { nid: nid, isAgent: true },
    ],
  });
  if (bannedAgent) {
    res.status(403);
    throw new Error("Banned agent cannot be added again");
  }
  const existingAgent = await Agent.findOne({
    $or: [{ email: email }, { number: number }, { nid: nid }],
  });

  if (existingAgent) {
    res.status(400);
    throw new Error("Agent already exists");
  }
  const agentCompany = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  const agent = await Agent.create({
    name,
    agentCompany,
    email,
    nid,
    number,
    address,
    agentAvatar,
  });
  if (agent) {
    res.status(201).json(agent);
  } else {
    res.status(400);
    throw new Error("Invalid agent data");
  }
});
const getAllAgents = asyncHandler(async (req, res) => {
  if (
    req.user.role !== "msbCompany" &&
    req.user.role !== "msbIndividual"
  ) {
    res.status(401);
    throw new Error("Not authorized to view agents");
  }

  const agents = await Agent.find({}).populate("agentCompany");
  res.json(agents);
});
const getAgentsForCompany = asyncHandler(async (req, res) => {
  if (req.user.role !== "agentCompany") {
    res.status(401);
    throw new Error("Not authorized to view agents");
  }
  const agents = await Agent.find({ "agentCompany.id": req.user._id });
  res.json(agents);
});
const getAllAgentCompanies = asyncHandler(async (req, res) => {
  if (req.user.role === "agentCompany") {
    res.status(401);
    throw new Error("Not authorized to view agent companies");
  }

  const agentCompanies = await AgentCompany.find({});
  res.json(agentCompanies);
});
const reportAgent = asyncHandler(async (req, res) => {
  const { incident, isGood, attemptFraud, attemptFraudIncident } = req.body;
  if (
    req.user.role !== "msbCompany" &&
    req.user.role !== "msbIndividual" &&
    req.user.role !== "admin"
  ) {
    res.status(401);
    throw new Error("Not authorized to report agents");
  }

  const agent = await Agent.findById(req.params.id);
  if (agent) {
    if (agent.isBanned) {
      res.status(403);
      throw new Error("This agent is banned and cannot be reported.");
    }
    if (attemptFraud) {
      agent.attemptFraud = true;
      agent.attemptFraudCount += 1;
      agent.attemptFraudDetails.push({
        user: req.user._id,
        name: req.user.name,
        incident: attemptFraudIncident,
      });
    } else {
      agent.incident = incident;
      agent.isGood = isGood;
    }
    await agent.save();
    if (agent.agentCompanyName) {
      const agentCompany = await AgentCompany.findById(agent.agentCompanyName);
      if (agentCompany) {
        if (attemptFraud) {
          agentCompany.attemptFraud = true;
          agentCompany.attemptFraudCount += 1;
          agentCompany.attemptFraudDetails.push({
            user: req.user._id,
            name: req.user.name,
            incident: attemptFraudIncident,
          });
        } else {
          agentCompany.incident = incident;
          agentCompany.isGood = isGood;
        }
        await agentCompany.save();
      }
    }

    res.json({ message: "Agent reported successfully" });
  } else {
    res.status(404);
    throw new Error("Agent not found");
  }
});
const reportAgentCompany = asyncHandler(async (req, res) => {
  const { incident, isGood, attemptFraud, attemptFraudIncident } = req.body;

  if (
    req.user.role !== "msbCompany" &&
    req.user.role !== "msbIndividual" &&
    req.user.role !== "admin"
  ) {
    res.status(401);
    throw new Error("Not authorized to report agent companies");
  }

  const agentCompany = await AgentCompany.findById(req.params.id);

  if (agentCompany) {
    if (agentCompany.isBanned) {
      res.status(403);
      throw new Error("This agent company is banned and cannot be reported.");
    }
    if (attemptFraud) {
      agentCompany.attemptFraud = true;
      agentCompany.attemptFraudCount += 1;
      agentCompany.attemptFraudDetails.push({
        user: req.user._id,
        name: req.user.name,
        incident: attemptFraudIncident,
      });
    } else {
      agentCompany.incident = incident;
      agentCompany.isGood = isGood;
      const associatedUser = await User.findOne({ email: agentCompany.email });
      if (associatedUser) {
        associatedUser.isGood = isGood;
        await associatedUser.save();
      }
    }
    await agentCompany.save();

    res.json({ message: "Agent company reported successfully" });
  } else {
    res.status(404);
    throw new Error("Agent company not found");
  }
});
const getAllFraudAgents = asyncHandler(async (req, res) => {
  try {
    const fraudAgents = await Agent.find({ isGood: false });
    res.json(fraudAgents);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

const getAllFraudAgentCompanies = asyncHandler(async (req, res) => {
  try {
    const fraudAgentCompanies = await AgentCompany.find({ isGood: false });
    res.json(fraudAgentCompanies);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
const getAllFraudAttemptsAgents = asyncHandler(async (req, res) => {
  const fraudAttemptsAgents = await Agent.find({
    "attemptFraudDetails.0": { $exists: true },
  });
  res.json(fraudAttemptsAgents);
});
const getAllFraudAttemptsAgentCompanies = asyncHandler(async (req, res) => {
  const fraudAttemptsAgentCompanies = await AgentCompany.find({
    "attemptFraudDetails.0": { $exists: true },
  });
  res.json(fraudAttemptsAgentCompanies);
});

export {
  addAgent,
  getAllAgents,
  getAllAgentCompanies,
  reportAgent,
  reportAgentCompany,
  getAgentsForCompany,
  getAllFraudAgents,
  getAllFraudAgentCompanies,
  getAllFraudAttemptsAgents,
  getAllFraudAttemptsAgentCompanies,
};
