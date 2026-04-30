import { createHash, randomUUID } from "node:crypto";

export const recoveryLimits = {
  challengeMinutes: 15,
  resetMinutes: 20,
  sessionMinutes: 30,
  maxContactAttempts: 5,
  maxFaceAttempts: 3,
  maxPasswordAttempts: 3,
} as const;

export function hashValue(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export function hashCode(value: string) {
  return createHash("sha256").update(value.trim()).digest("hex");
}

export function generateRecoveryPublicToken() {
  return randomUUID().replace(/-/g, "");
}

export function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function maskEmail(email: string) {
  const [local, domain] = email.split("@");

  if (!local || !domain) {
    return "contato informado";
  }

  const localMask = local.length <= 2 ? `${local[0] ?? "*"}*` : `${local.slice(0, 2)}***`;

  return `${localMask}@${domain}`;
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length < 4) {
    return "telefone informado";
  }

  return `(${digits.slice(0, 2)}) *****-${digits.slice(-4)}`;
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function isExpired(date?: Date | null) {
  return !date || date.getTime() < Date.now();
}

export function createGenericStartMessage(method: "EMAIL_FACE" | "PHONE_FACE") {
  return method === "EMAIL_FACE"
    ? "Se a conta for elegivel, enviaremos um código para o e-mail informado e depois solicitaremos a verificação facial."
    : "Se a conta for elegivel, enviaremos um código para o telefone informado e depois solicitaremos a verificação facial.";
}
