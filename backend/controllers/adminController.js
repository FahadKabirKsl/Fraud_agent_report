import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Agent from "../models/agentModel.js";
import AgentCompany from "../models/agentCompanyModel.js";
import Banned from "../models/bannedModel.js";
const getAllAgents = asyncHandler(async (req, res) => {
  try {
    const agents = await Agent.find({});
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
const getAllAgentCompanies = asyncHandler(async (req, res) => {
  try {
    const agentCompanies = await AgentCompany.find({});
    res.json(agentCompanies);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
const getAllMoneyLendingEntities = asyncHandler(async (req, res) => {
  try {
    const companies = await User.find({ role: "msbCompany" });
    const individuals = await User.find({ role: "msbIndividual" });

    const allMoneyLendingEntities = {
      companies: companies,
      individuals: individuals,
    };

    res.json(allMoneyLendingEntities);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

const markSafeAgent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Ensure that the user making the request is an admin
    if (req.user.role !== "admin") {
      res
        .status(403)
        .json({ message: "Not authorized to perform this action" });
      return;
    }

    const agent = await Agent.findById(id);

    if (agent) {
      // Mark agent as safe
      agent.isGood = true;
      agent.incident = ""; // Remove incident details
      await agent.save();

      // Also mark the associated agent company as safe, if applicable
      if (agent.agentCompanyName) {
        const agentCompany = await AgentCompany.findById(
          agent.agentCompanyName
        );
        if (agentCompany) {
          agentCompany.isGood = true;
          agentCompany.incident = ""; // Remove incident details
          await agentCompany.save();
        }
      }

      res.json({ message: "Agent marked safe successfully" });
    } else {
      res.status(404).json({ message: "Agent not found" });
    }
  } catch (error) {
    console.error("Error marking agent safe:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

const markSafeAgentCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Ensure that the user making the request is an admin
    if (req.user.role !== "admin") {
      res
        .status(403)
        .json({ message: "Not authorized to perform this action" });
      return;
    }

    const agentCompany = await AgentCompany.findById(id);

    if (agentCompany) {
      // Mark agent company as safe
      agentCompany.isGood = true;
      agentCompany.incident = ""; // Remove incident details
      await agentCompany.save();

      res.json({ message: "Agent company marked safe successfully" });
    } else {
      res.status(404).json({ message: "Agent company not found" });
    }
  } catch (error) {
    console.error("Error marking agent company safe:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
const banAgent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // console.log("Banning agent with id:", id);
    const agent = await Agent.findById(id);
    if (agent) {
      await Banned.create({
        name: agent.name,
        email: agent.email,
        number: agent.number,
        nid: agent.nid,
        avatar: agent.agentAvatar,
        isAgent: true,
        isCompany: false,
      });
      await Agent.findByIdAndRemove(id);
      res.json({ message: "Agent banned successfully" });
    } else {
      console.log("Agent not found with id:", id);
      res.status(404).json({ message: "Agent not found" });
    }
  } catch (error) {
    console.error("Error banning agent:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
const banAgentCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // console.log("Banning agent company with id:", id);
    const agentCompany = await AgentCompany.findById(id);
    if (agentCompany) {
      await Banned.create({
        name: agentCompany.name,
        email: agentCompany.email,
        avatar: agentCompany.avatar,
        number: agentCompany.number,
        cid: agentCompany.cid,
        isAgent: false,
        isCompany: true,
      });
      await AgentCompany.findByIdAndRemove(id);
      const user = await User.findOne({ email: agentCompany.email });
      if (user) {
        await User.findByIdAndRemove(user._id);
      }

      res.json({ message: "Agent company banned successfully" });
    } else {
      console.log("Agent company not found with id:", id);
      res.status(404).json({ message: "Agent company not found" });
    }
  } catch (error) {
    console.error("Error banning agent company:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

const getAllBanned = asyncHandler(async (req, res) => {
  try {
    const bannedEntities = await Banned.find({});
    res.json(bannedEntities);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
export {
  getAllAgents,
  getAllAgentCompanies,
  banAgent,
  banAgentCompany,
  getAllMoneyLendingEntities,
  getAllBanned,
  markSafeAgent,
  markSafeAgentCompany,
};
