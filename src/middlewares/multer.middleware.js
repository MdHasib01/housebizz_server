import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

const tempPath = path.join(process.cwd(), "public", "temp"); // Absolute path

// Ensure the directory exists
const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
};

// Setup multer storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      await ensureDirectoryExists(tempPath); // Ensure the directory exists
      cb(null, tempPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
