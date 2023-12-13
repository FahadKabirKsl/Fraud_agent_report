import express from "express";
const router = express.Router();
import { protect, checkUserRole } from "../middleware/authMiddleware.js";
import {
  getAllAgents,
  getAllAgentCompanies,
  banAgent,
  // unbanAgent,
  banAgentCompany,
  // unbanAgentCompany,
  getAllMoneyLendingEntities,
  getAllBanned,
  markSafeAgent,
  markSafeAgentCompany,
} from "../controllers/adminController.js";
import {
  reportAgentCompany,
  reportAgent,
  getAllFraudAgents,
  getAllFraudAgentCompanies,
} from "../controllers/agentController.js";
router.get("/agents", protect, checkUserRole(["admin"]), getAllAgents);
router.get(
  "/agentCompanies",
  protect,
  checkUserRole(["admin"]),
  getAllAgentCompanies
);
router.put("/agents/:id", protect, checkUserRole(["admin"]), reportAgent);
router.put(
  "/agentCompanies/:id",
  protect,
  checkUserRole(["admin"]),
  reportAgentCompany
);
router.put("/agents/:id/ban", protect, checkUserRole(["admin"]), banAgent);
// router.put("/agents/:id/unban", protect, checkUserRole(["admin"]), unbanAgent);
router.put(
  "/agentCompanies/:id/ban",
  protect,
  checkUserRole(["admin"]),
  banAgentCompany
);
// router.put(
//   "/agentCompanies/:id/unban",
//   protect,
//   checkUserRole(["admin"]),
//   unbanAgentCompany
// );
router.put(
  "/agents/:id/markSafe",
  protect,
  checkUserRole(["admin"]),
  markSafeAgent
);
router.put(
  "/agentCompanies/:id/markSafe",
  protect,
  checkUserRole(["admin"]),
  markSafeAgentCompany
);
router.get(
  "/moneyLendingEntities",
  protect,
  checkUserRole(["admin"]),
  getAllMoneyLendingEntities
);

router.get("/bannedEntities", protect, checkUserRole(["admin"]), getAllBanned);
// Route to get all fraud agents
router.route("/fraudAgents").get(getAllFraudAgents);
// Route to get all fraud agent companies
router.route("/fraudAgentCompanies").get(getAllFraudAgentCompanies);
export default router;
