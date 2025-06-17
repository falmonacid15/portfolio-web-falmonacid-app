import { z } from "zod";

export const createPortfolioPageSchema = z.object({
  title: z.string().min(1, "Titulo es requerido"),
  description: z.string().min(1, "Descripcion es requerido"),
});

export type CreatePortfolioPageInput = z.TypeOf<
  typeof createPortfolioPageSchema
>;
