import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  shortDescription: z.string().min(1, "Descripción corta es requerida"),
  longDescription: z.string().min(1, "Descripción larga es requerida"),
  mainImage: z.instanceof(File, { message: "Imagen principal es requerida" }),
  images: z.array(z.instanceof(File, { message: "Imagen es requerida" })),
  repositoryUrl: z.string().min(1, "Url de repositorio es requerida"),
  demoUrl: z.string().min(1, "Url de demo es requerida"),
  technologies: z.array(z.string().min(1, "Tecnología es requerida")),
  languages: z.array(z.string().min(1, "Lenguaje es requerido")),
  hasDemo: z.boolean(),
  hasRepo: z.boolean(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  portfolioId: z.string(),
  homeId: z.string().optional(),
});

export type CreateProjectInput = z.TypeOf<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();
