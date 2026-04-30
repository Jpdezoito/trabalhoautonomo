import bcrypt from "bcryptjs";
import { PasswordRecoveryStage, PasswordRecoveryStatus, type PasswordRecoveryMethod } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logRecoveryAttempt } from "@/features/recovery/audit-service";
import { sendRecoveryEmailChallenge } from "@/features/recovery/email-service";
import { verifyFacialRecoveryFactor } from "@/features/recovery/facial-service";
import { sendRecoveryPhoneOtp } from "@/features/recovery/phone-service";
import {
  addMinutes,
  createGenericStartMessage,
  generateOtpCode,
  generateRecoveryPublicToken,
  hashCode,
  hashValue,
  isExpired,
  maskEmail,
  maskPhone,
  recoveryLimits,
} from "@/features/recovery/utils";

export async function startPasswordRecovery(input: {
  method: PasswordRecoveryMethod;
  identifier: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const now = new Date();
  const normalizedIdentifier =
    input.method === "EMAIL_FACE" ? input.identifier.trim().toLowerCase() : input.identifier.replace(/\D/g, "");
  const user =
    input.method === "EMAIL_FACE"
      ? await prisma.user.findUnique({
          where: { email: normalizedIdentifier },
        })
      : (
          await prisma.user.findMany({
            where: {
              phone: {
                not: null,
              },
            },
          })
        ).find((item) => (item.phone ?? "").replace(/\D/g, "") === normalizedIdentifier) ?? null;

  const eligible =
    Boolean(user?.id) &&
    Boolean(user?.facialRecoveryEnabled) &&
    (await prisma.facialEnrollment.count({
      where: {
        userId: user?.id,
        status: "APPROVED",
        usableForPasswordRecovery: true,
        deletedAt: null,
      },
    })) > 0;

  const code = generateOtpCode();
  const session = await prisma.passwordRecoverySession.create({
    data: {
      publicToken: generateRecoveryPublicToken(),
      userId: eligible ? user?.id : null,
      method: input.method,
      status: eligible ? PasswordRecoveryStatus.PENDING_CONTACT : PasswordRecoveryStatus.UNAVAILABLE,
      currentStage: PasswordRecoveryStage.CONTACT,
      contactHash: hashValue(normalizedIdentifier),
      contactMasked: input.method === "EMAIL_FACE" ? maskEmail(normalizedIdentifier) : maskPhone(input.identifier),
      challengeCodeHash: eligible ? hashCode(code) : undefined,
      challengeExpiresAt: eligible ? addMinutes(now, recoveryLimits.challengeMinutes) : undefined,
      challengeSentAt: eligible ? now : undefined,
      unavailableReason: eligible ? undefined : "Metodo indisponivel",
      expiresAt: addMinutes(now, recoveryLimits.sessionMinutes),
      metadata: {
        identifierType: input.method === "EMAIL_FACE" ? "email" : "phone",
      },
    },
  });

  if (eligible && user) {
    if (input.method === "EMAIL_FACE") {
      await sendRecoveryEmailChallenge({
        email: user.email,
        code,
      });
    } else if (user.phone) {
      await sendRecoveryPhoneOtp({
        phone: user.phone,
        code,
      });
    }
  }

  await logRecoveryAttempt({
    sessionId: session.id,
    stage: PasswordRecoveryStage.START,
    success: true,
    reason: eligible ? "challenge_sent" : "generic_unavailable",
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    metadata: {
      method: input.method,
    },
  });

  return {
    sessionToken: session.publicToken,
    status: eligible ? "challenge_sent" : "unavailable",
    method: input.method,
    maskedDestination: session.contactMasked,
    message: createGenericStartMessage(input.method),
    developmentCode: process.env.NODE_ENV === "development" && eligible ? code : undefined,
  };
}

export async function verifyRecoveryContactFactor(input: {
  sessionToken: string;
  code: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const session = await prisma.passwordRecoverySession.findUnique({
    where: { publicToken: input.sessionToken },
  });

  if (!session || isExpired(session.expiresAt) || isExpired(session.challengeExpiresAt)) {
    if (session) {
      await expireRecoverySession(session.id);
    }

    throw new Error("Este pedido de recuperação expirou. Inicie novamente.");
  }

  if (session.status === "UNAVAILABLE") {
    throw new Error("Este metodo de recuperação está indisponivel para está conta.");
  }

  if (session.contactAttemptCount >= recoveryLimits.maxContactAttempts) {
    await prisma.passwordRecoverySession.update({
      where: { id: session.id },
      data: {
        status: PasswordRecoveryStatus.BLOCKED,
        lastAttemptAt: new Date(),
      },
    });

    throw new Error("Muitas tentativas de código. Inicie uma nova recuperação.");
  }

  const valid = session.challengeCodeHash === hashCode(input.code);

  await prisma.passwordRecoverySession.update({
    where: { id: session.id },
    data: {
      contactAttemptCount: { increment: 1 },
      lastAttemptAt: new Date(),
      ...(valid
        ? {
            status: PasswordRecoveryStatus.CONTACT_VERIFIED,
            currentStage: PasswordRecoveryStage.FACE,
            contactVerifiedAt: new Date(),
          }
        : {}),
    },
  });

  await logRecoveryAttempt({
    sessionId: session.id,
    stage: PasswordRecoveryStage.CONTACT,
    success: valid,
    reason: valid ? "contact_verified" : "invalid_code",
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  if (!valid) {
    throw new Error("Código inválido ou expirado. Tente novamente.");
  }

  return {
    nextStep: "face",
    maskedDestination: session.contactMasked,
    message: "Contato validado com sucesso. Agora conclua a verificação facial.",
  };
}

export async function verifyRecoveryFaceFactor(input: {
  sessionToken: string;
  imageDataUrl: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const session = await prisma.passwordRecoverySession.findUnique({
    where: { publicToken: input.sessionToken },
  });

  if (!session || isExpired(session.expiresAt)) {
    if (session) {
      await expireRecoverySession(session.id);
    }

    throw new Error("Está sessão de recuperação expirou. Inicie novamente.");
  }

  if (session.status !== "CONTACT_VERIFIED") {
    throw new Error("Valide primeiro o e-mail ou telefone antes da verificação facial.");
  }

  if (session.faceAttemptCount >= recoveryLimits.maxFaceAttempts) {
    await prisma.passwordRecoverySession.update({
      where: { id: session.id },
      data: {
        status: PasswordRecoveryStatus.BLOCKED,
        lastAttemptAt: new Date(),
      },
    });

    throw new Error("Limite de tentativas faciais atingido. Inicie uma nova recuperação.");
  }

  const result = await verifyFacialRecoveryFactor({
    userId: session.userId,
    imageDataUrl: input.imageDataUrl,
  });

  const now = new Date();
  await prisma.passwordRecoverySession.update({
    where: { id: session.id },
    data: {
      faceAttemptCount: { increment: 1 },
      lastAttemptAt: now,
      ...(result.success
        ? {
            status: PasswordRecoveryStatus.FACE_VERIFIED,
            currentStage: PasswordRecoveryStage.PASSWORD,
            faceVerifiedAt: now,
            resetAllowedUntil: addMinutes(now, recoveryLimits.resetMinutes),
          }
        : {}),
    },
  });

  await logRecoveryAttempt({
    sessionId: session.id,
    stage: PasswordRecoveryStage.FACE,
    success: result.success,
    reason: result.success ? "face_verified" : result.reason,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  if (!result.success) {
    throw new Error(result.reason || "Não foi possível validar a verificação facial.");
  }

  return {
    nextStep: "password",
    message: "Verificação facial concluida. Agora você pode definir uma nova senha.",
  };
}

export async function resetPasswordAfterRecovery(input: {
  sessionToken: string;
  password: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const session = await prisma.passwordRecoverySession.findUnique({
    where: { publicToken: input.sessionToken },
  });

  if (!session || !session.userId || isExpired(session.expiresAt) || isExpired(session.resetAllowedUntil)) {
    if (session) {
      await expireRecoverySession(session.id);
    }

    throw new Error("O prazo para redefinir a senha expirou. Inicie novamente.");
  }

  if (session.status !== "FACE_VERIFIED") {
    throw new Error("A recuperação ainda não concluiu os dois fatores obrigatórios.");
  }

  if (session.passwordAttemptCount >= recoveryLimits.maxPasswordAttempts) {
    await prisma.passwordRecoverySession.update({
      where: { id: session.id },
      data: {
        status: PasswordRecoveryStatus.BLOCKED,
        lastAttemptAt: new Date(),
      },
    });

    throw new Error("Limite de tentativas excedido. Inicie uma nova recuperação.");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const now = new Date();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.userId },
      data: {
        passwordHash,
      },
    }),
    prisma.passwordRecoverySession.update({
      where: { id: session.id },
      data: {
        passwordAttemptCount: { increment: 1 },
        status: PasswordRecoveryStatus.COMPLETED,
        currentStage: PasswordRecoveryStage.DONE,
        completedAt: now,
        lastAttemptAt: now,
      },
    }),
  ]);

  await logRecoveryAttempt({
    sessionId: session.id,
    stage: PasswordRecoveryStage.PASSWORD,
    success: true,
    reason: "password_reset_completed",
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  return {
    completed: true,
    message: "Senha redefinida com sucesso. Você já pode entrar na plataforma.",
  };
}

async function expireRecoverySession(sessionId: string) {
  await prisma.passwordRecoverySession.update({
    where: { id: sessionId },
    data: {
      status: PasswordRecoveryStatus.EXPIRED,
      currentStage: PasswordRecoveryStage.DONE,
    },
  });
}
