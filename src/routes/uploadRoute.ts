import express from "express";
import formidable from "express-formidable";
import { uploadFiles } from "../controllers/uploadContoller";

const router = express.Router();

// Wrap route with formidable middleware to parse multipart/form-data
// router.post("/", formidable({ multiples: true }), uploadFiles);
router.post("/", formidable({ 
  multiples: true,
  keepExtensions: true, // Keep original extensions
  maxFileSize: 10 * 1024 * 1024 // 10MB limit
}), uploadFiles);

export default router;