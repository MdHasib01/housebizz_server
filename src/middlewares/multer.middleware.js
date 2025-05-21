import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../utils/s3.js";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const tempDir = path.join(process.cwd(), "public", "temp");
//     cb(null, tempDir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
});
