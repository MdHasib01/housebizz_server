import { Router } from "express";
import {
  applyForAgent,
  getAgent,
  getAgents,
  isApplied,
  verifyAgent,
} from "../controllers/agent.controller.js";

const router = Router();

router.route("/").post(applyForAgent);
router.route("/").get(getAgents);
router.route("/:id").get(getAgent);
router.route("/changeStatus/:id").post(verifyAgent);
router.route("/isApplied/:id").get(isApplied);
export default router;
