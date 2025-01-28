import { Router } from "express";
import { applyForAgent, getAgents } from "../controllers/agent.controller.js";

const router = Router();

router.route("/").post(applyForAgent);
router.route("/").get(getAgents);
export default router;
