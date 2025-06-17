import { z } from "zod";

export const accountSettingSchema = z.object({
  name: z
    .string()
    .min(1, "Nombre es requerido")
    .max(100, "Nombre debe tener máximo 100 caracteres"),
  email: z
    .string()
    .min(1, "Correo electrónico es requerido")
    .email("Formato de email inválido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional()
    .or(z.literal("")),
  confirmPassword: z
    .string()
    .min(1, "Confirmar contraseña es requerida")
    .optional()
    .or(z.literal("")),
}).refine(
  (data) => {
    // If password is provided, confirmPassword must match
    if (data.password && data.password.length > 0) {
      return data.password === data.confirmPassword;
    }
    // If no password is provided, validation passes
    return true;
  },
  {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  }
);

export type AccountSettingInput = z.TypeOf<typeof accountSettingSchema>;
