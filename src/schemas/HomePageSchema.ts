import { z } from "zod";

export const createhomePageSchema = z.object({
  heroTitle: z.string().min(1, "Titulo es requerido"),
  heroSubtitle: z.string().min(1, "Subtitulo es requerido"),
  descriptions: z.array(z.string().min(1, "Descripcion es requerida")),
  workExperienceTitle: z.string().min(1, "Titulo es requerido"),
  workExperienceSubtitle: z.string().min(1, "Subtitulo es requerido"),
  portfolioTitle: z.string().min(1, "Titulo es requerido"),
  portfolioSubtitle: z.string().min(1, "Subtitulo es requerido"),
});

export type CreateHomePageInput = z.TypeOf<typeof createhomePageSchema>;

export const updateHomePageSchema = createhomePageSchema.partial();
