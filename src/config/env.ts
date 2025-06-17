import { z } from "zod";

const envSchema = z.object({
  API_BASE_URL: z.string().min(1, "API base URL is required"),
  GITHUB_PERSONAL_TOKEN: z.string().min(1, "GitHub personal token is required"),
});

type EnvConfig = z.infer<typeof envSchema>;

function validateEnv(): EnvConfig {
  const env = {
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

export const getApiBaseUrl = () => env.API_BASE_URL;

export const getGithubPersonalToken = () => env.GITHUB_PERSONAL_TOKEN;
