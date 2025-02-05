import { Agent } from "../model/agent.model.js";
import { User } from "../model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const applyForAgent = asyncHandler(async (req, res) => {
  const { userID, licenseNumber, yearsOfExperience, officeAddress } = req.body;
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

const getAgent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const agent = await Agent.findById(id).populate(
    "userID",
    "fullName email phone avatar username"
  );
  return res.status(200).json({ message: "Agent", data: agent });
});

const verifyAgent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { verificationStatus } = req.body;

  const agent = await Agent.findById(id);

  const updateAgent = await Agent.findByIdAndUpdate(
    id,
    { verificationStatus },
    { new: true }
  );
  if (verificationStatus === "verified") {
    await User.findByIdAndUpdate(agent.userID, { role: "agent" });
  } else if (
    verificationStatus === "rejected" ||
    verificationStatus === "pending"
  ) {
    await User.findByIdAndUpdate(agent.userID, { role: "user" });
  }

  return res.status(200).json({ message: "Agent status changed", data: agent });
});

const isApplied = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const agent = await Agent.findOne({
    "userID._id": id,
  });
  res.status(200).json({ message: "Apply for Agent", data: agent });
  if (!agent) {
    return res.status(200).json({ message: "Apply for Agent", data: false });
  }
  if (agent.verificationStatus === "pending") {
    return res.status(200).json({ message: "Apply for Agent", data: true });
  } else {
    return res.status(200).json({ message: "Apply for Agent", data: false });
  }
});
export { applyForAgent, getAgents, verifyAgent, getAgent, isApplied };
