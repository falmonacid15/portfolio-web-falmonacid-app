import { z } from "zod";

export const createContactPageSchema = z.object({
  title: z.string().min(1, "Titulo es requerido"),
  subtitle: z.string().min(1, "Subtitulo es requerido"),
  email: z.string().min(1, "Email es requerido"),
  emailLabel: z.string().min(1, "Label es requerido"),
  linkedIn: z.string().min(1, "LinkedIn es requerido"),
  linkedInLabel: z.string().min(1, "Label es requerido"),
  github: z.string().min(1, "Github es requerido"),
  githubLabel: z.string().min(1, "Label es requerido"),
});

export type CreateContactPageInput = z.TypeOf<typeof createContactPageSchema>;

export const updateContactPageSchema = createContactPageSchema.partial();
