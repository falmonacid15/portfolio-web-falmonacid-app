import { z } from "zod";

export const createAboutMePageSchema = z.object({
  title: z.string().min(1, "Titulo es requerido"),
  descriptions: z.array(z.string().min(1, "Descripcion es requerida")),
  image: z
    .instanceof(File, { message: "Imagen es requerida" })
    .or(z.string().min(1, "Imagen es requerida")),
  skillsTitle: z.string().min(1, "Titulo es requerido"),
  skillsSubtitle: z.string().min(1, "Subtitulo es requerido"),
});

export type CreateAboutMePageInput = z.TypeOf<typeof createAboutMePageSchema>;

export const updateAboutMePageSchema = createAboutMePageSchema.partial();
