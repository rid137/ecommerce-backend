import express from "express";
import formidable from "express-formidable";
import uploadContoller from "../controllers/upload.controller";

const router = express.Router();

router.post(
  "/",
  formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  }),
  uploadContoller.uploadFiles
);

export default router;