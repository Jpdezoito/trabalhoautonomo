import { FacialEnrollmentStatus, UserRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { identityFeatureFlags } from "@/features/identity/constants";
import { storeFacialEnrollmentReference } from "@/features/identity/provider";
import { syncFacialTrustVerification } from "@/features/trust/service";
import { buildFacialEnrollmentSummary, isIdentityVerificationEnabledForRole, mapPrismaFacialStatusToFrontend } from "@/features/identity/utils";

export const facialEnrollmentRequestSchema = z.object({
  imageDataUrl: z.string().min(40, "Envie a captura facial."),
  captureSource: z.enum(["webcam", "upload"]),
  consentAccepted: z.boolean().refine((value) => value, {
    message: "Você precisa aceitar o consentimento antes da captura.",
  }),
});

export const facialEnrollmentReviewSchema = z.object({
  status: z.enum(["IN_REVIEW", "APPROVED", "REJECTED"]),
  reviewNotes: z.string().max(800, "Use ate 800 caracteres.").optional(),
});

export async function createFacialEnrollmentForUser(input: {
  userId: string;
  role: UserRole;
  imageDataUrl: string;
  captureSource: "webcam" | "upload";
  consentAccepted: boolean;
}) {
  if (!isIdentityVerificationEnabledForRole(input.role)) {
    throw new Error("A verificação facial não está habilitada para está conta.");
  }

  if (input.imageDataUrl.length > identityFeatureFlags.maxDataUrlLength) {
    throw new Error("A captura facial enviada excede o tamanho suportado.");
  }

  const reference = await storeFacialEnrollmentReference({
    userId: input.userId,
    imageDataUrl: input.imageDataUrl,
    captureSource: input.captureSource,
  });

  const previousAttempts = await prisma.facialEnrollment.count({
    where: {
      userId: input.userId,
      deletedAt: null,
    },
  });

  const enrollment = await prisma.facialEnrollment.create({
    data: {
      userId: input.userId,
      status: FacialEnrollmentStatus.IN_REVIEW,
      captureSource: input.captureSource === "webcam" ? "WEBCAM" : "UPLOAD",
      provider: reference.provider,
      storageKey: reference.storageKey,
      metadata: reference.metadata,
      consentAcceptedAt: new Date(),
      submittedAt: new Date(),
      retryCount: previousAttempts,
      usableForPasswordRecovery: false,
    },
  });

  await prisma.user.update({
    where: { id: input.userId },
    data: {
      facialRecoveryEnabled: false,
      facialRecoveryEnabledAt: null,
    },
  });

  if (input.role === UserRole.WORKER) {
    await prisma.workerProfile.updateMany({
      where: { userId: input.userId },
      data: {
        verificationStatus: "PENDING",
      },
    });
  }

  await syncFacialTrustVerification({
    userId: input.userId,
    status: "IN_REVIEW",
    provider: reference.provider,
    providerReference: reference.storageKey,
    providerMetadata: reference.metadata,
  });

  return buildFacialEnrollmentSummary({
    id: enrollment.id,
    status: mapPrismaFacialStatusToFrontend(enrollment.status),
    captureSource: input.captureSource,
    consentAccepted: true,
    submittedAt: enrollment.submittedAt.toISOString(),
    retryCount: enrollment.retryCount,
    recoveryEnabled: false,
  });
}

export async function reviewFacialEnrollment(input: {
  enrollmentId: string;
  reviewerId: string;
  status: "IN_REVIEW" | "APPROVED" | "REJECTED";
  reviewNotes?: string;
}) {
  const enrollment = await prisma.facialEnrollment.findUnique({
    where: { id: input.enrollmentId },
    include: { user: true },
  });

  if (!enrollment || enrollment.deletedAt) {
    throw new Error("Registro de verificação facial não encontrado.");
  }

  const now = new Date();
  const updated = await prisma.facialEnrollment.update({
    where: { id: input.enrollmentId },
    data: {
      status: input.status,
      reviewedById: input.reviewerId,
      reviewedAt: now,
      approvedAt: input.status === "APPROVED" ? now : null,
      rejectedAt: input.status === "REJECTED" ? now : null,
      reviewNotes: input.reviewNotes,
      usableForPasswordRecovery: input.status === "APPROVED",
    },
  });

  await prisma.user.update({
    where: { id: enrollment.userId },
    data: {
      facialRecoveryEnabled: input.status === "APPROVED",
      facialRecoveryEnabledAt: input.status === "APPROVED" ? now : null,
    },
  });

  if (enrollment.user.role === UserRole.WORKER) {
    await prisma.workerProfile.updateMany({
      where: { userId: enrollment.userId },
      data: {
        verificationStatus: input.status === "APPROVED" ? "APPROVED" : input.status === "REJECTED" ? "REJECTED" : "PENDING",
      },
    });
  }

  await syncFacialTrustVerification({
    userId: enrollment.userId,
    status: input.status,
    provider: updated.provider,
    providerReference: updated.storageKey,
    providerMetadata: updated.metadata ?? undefined,
    reviewNotes: updated.reviewNotes ?? undefined,
  });

  return buildFacialEnrollmentSummary({
    id: updated.id,
    status: mapPrismaFacialStatusToFrontend(updated.status),
    captureSource: updated.captureSource === "WEBCAM" ? "webcam" : "upload",
    consentAccepted: true,
    submittedAt: updated.submittedAt.toISOString(),
    reviewedAt: updated.reviewedAt?.toISOString(),
    reviewNotes: updated.reviewNotes ?? undefined,
    retryCount: updated.retryCount,
    recoveryEnabled: updated.usableForPasswordRecovery,
  });
}

export async function getLatestFacialEnrollmentSummaryForUser(userId: string) {
  const enrollment = await prisma.facialEnrollment.findFirst({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: [{ createdAt: "desc" }],
  });

  if (!enrollment) {
    return null;
  }

  return buildFacialEnrollmentSummary({
    id: enrollment.id,
    status: mapPrismaFacialStatusToFrontend(enrollment.status),
    captureSource: enrollment.captureSource === "WEBCAM" ? "webcam" : "upload",
    consentAccepted: Boolean(enrollment.consentAcceptedAt),
    submittedAt: enrollment.submittedAt.toISOString(),
    reviewedAt: enrollment.reviewedAt?.toISOString(),
    reviewNotes: enrollment.reviewNotes ?? undefined,
    retryCount: enrollment.retryCount,
    recoveryEnabled: enrollment.usableForPasswordRecovery,
  });
}
