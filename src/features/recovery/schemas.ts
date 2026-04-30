import { z } from "zod";

export const recoveryStartSchema = z.object({
  method: z.enum(["EMAIL_FACE", "PHONE_FACE"]),
  identifier: z.string().min(5, "Informe o e-mail ou telefone."),
});

export const recoveryVerifyContactSchema = z.object({
  sessionToken: z.string().min(10, "Sessão inválida."),
  code: z.string().min(6, "Informe o código de verificação."),
});

export const recoveryVerifyFaceSchema = z.object({
  sessionToken: z.string().min(10, "Sessão inválida."),
  imageDataUrl: z.string().min(40, "Envie a captura facial."),
});

export const recoveryResetPasswordSchema = z
  .object({
    sessionToken: z.string().min(10, "Sessão inválida."),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string().min(8, "Confirme a nova senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem.",
    path: ["confirmPassword"],
  });
