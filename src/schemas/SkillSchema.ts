import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  icon: z.string().min(1, { message: "El icono es requerido" }),
  categoryId: z.string().min(1, { message: "La categoría es requerida" }),
});

export type SkillInputs = z.infer<typeof skillSchema>;
