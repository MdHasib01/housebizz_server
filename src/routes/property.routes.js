import { Router } from "express";
import {
  addProperty,
  deleteProperty,
  getAllProperties,
  getPropertyById,
} from "../controllers/property.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/listProperty").post(
  verifyJWT,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  addProperty
);

router.route("/").get(getAllProperties);
router.route("/:propertyId").get(getPropertyById);
router.route("/:propertyId").delete(deleteProperty);

export default router;
