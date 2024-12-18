import { Router } from "express";
import {
  addProperty,
  getAllProperties,
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

router.route("/getAllProperties").get(getAllProperties);

export default router;
