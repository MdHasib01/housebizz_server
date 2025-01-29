import { Router } from "express";
import {
  applyForAgent,
  getAgent,
  getAgents,
  verifyAgent,
} from "../controllers/agent.controller.js";

const router = Router();

router.route("/").post(applyForAgent);
router.route("/").get(getAgents);
router.route("/:id").get(getAgent);
router.route("/changeStatus/:id").post(verifyAgent);
export default router;
