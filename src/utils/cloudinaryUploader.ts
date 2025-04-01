import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { getCloudinaryConfig } from "../config/env";
import { UploadApiResponse } from "cloudinary";

const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

async function convertToWebP(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (file.type === "image/webp") {
    return buffer;
  }

  return sharp(buffer).webp({ quality: 80 }).toBuffer();
}

export async function uploadImages(
  files: File[],
  folder: string = "uploads"
): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    try {
      const webpBuffer = await convertToWebP(file);

      const filename = `${Date.now()}-${file.name.split(".")[0]}`;

      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: filename,
            format: "webp",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error("Upload failed with no error"));
          }
        );

        const uint8Array = new Uint8Array(webpBuffer);
        uploadStream.write(uint8Array);
        uploadStream.end();
      });

      return result.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
}

export async function uploadImage(
  file: File,
  folder: string = "uploads"
): Promise<string> {
  const urls = await uploadImages([file], folder);
  return urls[0];
}
