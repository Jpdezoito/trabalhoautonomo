import { prisma } from "@/lib/prisma";
import { verifyLiveCaptureForRecovery } from "@/features/identity/provider";

export async function verifyFacialRecoveryFactor(input: {
  userId?: string | null;
  imageDataUrl: string;
}) {
  if (!input.userId) {
    return {
      success: false,
      reason: "Não foi possível validar a verificação facial para está conta.",
    };
  }

  const enrollment = await prisma.facialEnrollment.findFirst({
    where: {
      userId: input.userId,
      status: "APPROVED",
      usableForPasswordRecovery: true,
      deletedAt: null,
    },
    orderBy: [{ approvedAt: "desc" }, { createdAt: "desc" }],
  });

  if (!enrollment) {
    return {
      success: false,
      reason: "A recuperação facial não está disponível para está conta.",
    };
  }

  return verifyLiveCaptureForRecovery({
    imageDataUrl: input.imageDataUrl,
    enrollment,
  });
}
