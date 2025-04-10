import { z } from "zod";

const envSchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "Cloudinary cloud name is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "Cloudinary API key is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "Cloudinary API secret is required"),
  API_BASE_URL: z.string().min(1, "API base URL is required"),
  GITHUB_PERSONAL_TOKEN: z.string().min(1, "GitHub personal token is required"),
});

type EnvConfig = z.infer<typeof envSchema>;

function validateEnv(): EnvConfig {
  const env = {
    CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: import.meta.env.VITE_CLOUDINARY_API_SECRET,
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    GITHUB_PERSONAL_TOKEN: import.meta.env.VITE_GITHUB_PERSONAL_TOKEN,
  };

  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      console.error("❌ Invalid environment variables:", errorMessages);
      throw new Error(
        "Invalid environment variables. Check the console for more details."
      );
    }
    throw error;
  }
}

export const env = validateEnv();

export const getCloudinaryConfig = () => ({
  cloudName: env.CLOUDINARY_CLOUD_NAME,
  apiKey: env.CLOUDINARY_API_KEY,
  apiSecret: env.CLOUDINARY_API_SECRET,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "",
});

export const getApiBaseUrl = () => env.API_BASE_URL;

export const getGithubPersonalToken = () => env.GITHUB_PERSONAL_TOKEN;
