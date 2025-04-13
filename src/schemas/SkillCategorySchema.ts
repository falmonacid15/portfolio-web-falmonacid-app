import { z } from "zod";

export const skillCategorySchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  description: z.string().min(1, { message: "La descripcion es requerida" }),
  aboutMeId: z.string().min(1, { message: "Sobre mi es requerido" }),
});

export type SkillCategoryInputs = z.infer<typeof skillCategorySchema>;
