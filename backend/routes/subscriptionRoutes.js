import express from "express";
import { protect, checkUserRole } from "../middleware/authMiddleware.js";
import {
  createSubscription,
  getSubscriptionById,
  updateSubscription,
  cancelSubscription,
  listSubscriptions,
} from "../controllers/subscriptionController.js";
const router = express.Router();
router
  .route("/")
  .post(protect, createSubscription)
  .get(protect, checkUserRole(["admin"]), listSubscriptions);

router
  .route("/:id")
  .get(protect, getSubscriptionById)
  .put(protect, updateSubscription)
  .delete(protect, cancelSubscription);

export default router;
