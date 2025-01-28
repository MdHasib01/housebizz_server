import { Agent } from "../model/agent.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const applyForAgent = asyncHandler(async (req, res) => {
  const { userID, licenseNumber, yearsOfExperience, bio, officeAddress } =
    req.body;
  if (!userID) {
    return res.status(400).json({ message: "User ID is required" });
  }
  if (!licenseNumber) {
    return res.status(400).json({ message: "License Number is required" });
  }
  if (!yearsOfExperience) {
    return res.status(400).json({ message: "Year of Experience is required" });
  }
  if (!officeAddress) {
    return res.status(400).json({ message: "Office Address is required" });
  }
  const agent = await Agent.create({
    userID,
    licenseNumber,
    yearsOfExperience,
    bio,
    officeAddress,
  });

  const createAgent = await Agent.findById(agent._id).select();
  if (!createAgent) {
    return res
      .status(500)
      .json({ message: "Something went wrong while creating agent" });
  }

  return res
    .status(201)
    .json({ message: "Agent created successfully", data: createAgent });
});

const getAgents = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { verificationStatus: status } : {};
  const agents = await Agent.find(query).populate(
    "userID",
    "fullName email phone avatar username"
  );
  return res.status(200).json({ message: "Agents", data: agents });
});

export { applyForAgent, getAgents };
