import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export const newPasswordSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string().min(8, "Confirme a nova senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem.",
    path: ["confirmPassword"],
  });

export const clientRegistrationSchema = loginSchema.extend({
  name: z.string().min(2),
  phone: z.string().min(10),
  city: z.string().min(2),
  neighborhood: z.string().min(2),
});

export const workerRegistrationSchema = clientRegistrationSchema.extend({
  headline: z.string().min(10),
  categorySlug: z.string().min(2),
  yearsExperience: z.coerce.number().int().min(0),
  bio: z.string().min(40),
  whatsapp: z.string().min(10),
});
