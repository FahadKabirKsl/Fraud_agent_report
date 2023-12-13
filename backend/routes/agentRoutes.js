import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import {
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
} from "../controllers/agentController.js";
const router = express.Router();
router.post("/add-agent", protect, upload.single("agentAvatar"), addAgent);
router.get("/myagents", protect, getAgentsForCompany);
router.get("/list-agents", protect, getAllAgents);
router.get("/agentCompanies", protect, getAllAgentCompanies);
router.put("/reportAgent/:id", protect, reportAgent);
router.put("/reportAgentCompany/:id", protect, reportAgentCompany);
// Route to get all fraud agents (for public access)
router.get("/fraudAgents", protect, getAllFraudAgents);
// Route to get all fraud agent companies (for public access)
router.get("/fraudAgentCompanies", protect, getAllFraudAgentCompanies);
router.get("/attemptfraudAgents", protect, getAllFraudAttemptsAgents);
router.get(
  "/attemptfraudAgentCompanies",
  protect,
  getAllFraudAttemptsAgentCompanies
);

export default router;
