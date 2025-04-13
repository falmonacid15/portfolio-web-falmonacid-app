import { de } from "date-fns/locale";
import { z } from "zod";

export const workExperienceSchema = z.object({
  title: z.string().min(1, "El titulo es requerido"),
  dateRange: z.string().min(1, "El rango de fechas es requerido"),
  description: z.string().min(1, "La descripcion es requerida"),
  homeId: z.string().min(1, "El id de la HomePage es requerido"),
});

export type WorkExperienceInputs = z.infer<typeof workExperienceSchema>;
