import { Router } from "express";
import {
  applyForAgent,
  getAgents,
  verifyAgent,
} from "../controllers/agent.controller.js";

const router = Router();

router.route("/").post(applyForAgent);
router.route("/").get(getAgents);
router.route("/changeStatus/:id").post(verifyAgent);
export default router;
