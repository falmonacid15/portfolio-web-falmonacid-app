import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Correo electronico es requerido")
    .email("Formato de email invalido"),
  password: z.string().min(1, "Contraseña es requerida"),
});
