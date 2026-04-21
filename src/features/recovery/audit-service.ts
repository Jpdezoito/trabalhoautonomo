import { PasswordRecoveryStage, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function logRecoveryAttempt(input: {
  sessionId?: string;
  stage: PasswordRecoveryStage;
  success: boolean;
  reason?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}) {
  await prisma.passwordRecoveryAttemptLog.create({
    data: {
      sessionId: input.sessionId,
      stage: input.stage,
      success: input.success,
      reason: input.reason,
      ipAddress: input.ipAddress ?? undefined,
      userAgent: input.userAgent ?? undefined,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
    },
  });
}
