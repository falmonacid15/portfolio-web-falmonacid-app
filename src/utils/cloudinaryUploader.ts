export async function uploadImage(
  file: File,
  folder: string = "uploads"
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );
  formData.append("folder", folder);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) throw new Error(data.error?.message || "Upload failed");

    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
}

/**
 * Uploads multiple images to Cloudinary from the browser
 * @param files The files to upload
 * @param folder The folder to upload to
 * @returns An array of secure URLs of the uploaded images
 */
export async function uploadImages(
  files: File[],
  folder: string = "uploads"
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadImage(file, folder));
  return Promise.all(uploadPromises);
}
