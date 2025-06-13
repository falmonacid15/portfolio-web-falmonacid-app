import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  shortDescription: z.string().min(1, "Descripción corta es requerida"),
  longDescription: z.string().min(1, "Descripción larga es requerida"),

  mainImage: z
    .any()
    .optional()
    .refine(
      (file) =>
        file === undefined ||
        file === null ||
        file === Array ||
        file instanceof File ||
        (Array.isArray(file) && file[0] instanceof File),
      "Imagen principal no válida"
    ),

  images: z
    .any()
    .optional()
    .refine(
      (files) =>
        files === undefined ||
        files === null ||
        Array.isArray(files) ||
        (files instanceof FileList && files.length > 0) ||
        (files && files.length > 0 && files[0] instanceof File),
      "Imágenes no válidas"
    ),

  repositoryUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  technologies: z.array(z.string().min(1, "Tecnología es requerida")),
  languages: z.array(z.string().min(1, "Lenguaje es requerida")),
  hasDemo: z.boolean(),
  hasRepo: z.boolean(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  portfolioId: z.string(),
  homeId: z.string().optional(),
});

export type CreateProjectInput = z.TypeOf<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();
export type UpdateProjectInput = z.TypeOf<typeof updateProjectSchema>;
