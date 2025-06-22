import fs from "fs";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../utils/cloudinary";

interface UploadedFile {
  url: string;
  public_id: string;
  originalFilename?: string;
}

class UploadService {
  async uploadFiles(files: any): Promise<UploadedFile[]> {
    const filesArray = Array.isArray(files) ? files : [files];
    const uploadedFiles: UploadedFile[] = [];

    for (const file of filesArray) {
      const tempFilePath = file.path;
      const originalFilename = file.name;

      if (!tempFilePath || !fs.existsSync(tempFilePath)) continue;

      const stream = fs.createReadStream(tempFilePath);
      const publicId = originalFilename
        ? originalFilename.split(".")[0]
        : `file_${Date.now()}`;

      try {
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "product-listing",
              resource_type: "auto",
              public_id: publicId,
            },
            (error, result) => {
              if (error) return reject(error);
              if (result) return resolve(result);
              reject(new Error("Upload failed with no result"));
            }
          );

          stream.pipe(uploadStream);
        });

        uploadedFiles.push({
          url: result.secure_url,
          public_id: result.public_id,
          originalFilename,
        });

        fs.unlinkSync(tempFilePath);
      } catch (err) {
        console.error("Upload error:", err);
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    return uploadedFiles;
  }
}

export default new UploadService();