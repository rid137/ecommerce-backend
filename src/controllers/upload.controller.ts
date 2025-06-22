import { successResponse } from "../utils/apiResponse";
import { BadRequest } from "../errors/httpErrors";
import uploadService from "../services/upload.service";
import asyncHandler from "../middlewares/asyncHandler";

class UploadController {
  uploadFiles = asyncHandler(async (req, res) => {
    const files = (req as any).files?.files;

    if (!files) {
      throw BadRequest("No files uploaded");
    }

    const uploadedFiles = await uploadService.uploadFiles(files);

    if (!uploadedFiles.length) {
      throw BadRequest("All file uploads failed");
    }

    successResponse(res, {
      success: true,
      uploadedFiles,
      count: uploadedFiles.length,
      message:
        uploadedFiles.length === (Array.isArray(files) ? files.length : 1)
          ? "All files uploaded successfully"
          : `Uploaded ${uploadedFiles.length} of ${Array.isArray(files) ? files.length : 1} files`,
    });
  });
}

export default new UploadController();