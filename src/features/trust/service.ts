import { TrustVerificationStatus, TrustVerificationType, UserRole, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { runOptionalBackgroundCheckProvider } from "@/features/trust/provider";

export async function createTrustVerificationFlow(input: {
  userId: string;
  role: UserRole;
  documentType: string;
  documentReference: string;
  addressReference?: string;
  activityReference?: string;
  consentIdentity: boolean;
  consentBackground?: boolean;
  requestBackgroundCheck?: boolean;
}) {
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    include: {
      workerProfile: true,
      clientProfile: true,
      facialEnrollments: {
        where: { deletedAt: null },
        orderBy: [{ createdAt: "desc" }],
        take: 1,
      },
    },
  });

  if (!user) {
    throw new Error("Conta não encontrada.");
  }

  if (input.role === UserRole.CLIENT && !user.clientProfile) {
    throw new Error("Perfil de cliente não encontrado.");
  }

  if (input.role === UserRole.WORKER && !user.workerProfile) {
    throw new Error("Perfil profissional não encontrado.");
  }

  const consent = await prisma.consentRecord.create({
    data: {
      userId: input.userId,
      type: "TRUST_IDENTITY",
      title: "Consentimento para verificação de identidade e confiança da plataforma",
      acceptedAt: new Date(),
      metadata: {
        backgroundCheckRequested: Boolean(input.requestBackgroundCheck),
      },
    },
  });

  const commonData = {
    userId: input.userId,
    workerProfileId: user.workerProfile?.id,
    clientProfileId: user.clientProfile?.id,
    consentRecordId: consent.id,
  };

  await prisma.trustVerificationRequest.create({
    data: {
      ...commonData,
      type: TrustVerificationType.DOCUMENT,
      status: TrustVerificationStatus.PENDING,
      documentType: input.documentType,
      documentReference: input.documentReference,
    },
  });

  if (input.role === UserRole.WORKER && input.addressReference) {
    await prisma.trustVerificationRequest.create({
      data: {
        ...commonData,
        type: TrustVerificationType.ADDRESS,
        status: TrustVerificationStatus.PENDING,
        documentType: "Comprovante de endereco",
        documentReference: input.addressReference,
      },
    });
  }

  if (input.role === UserRole.WORKER && input.activityReference) {
    await prisma.trustVerificationRequest.create({
      data: {
        ...commonData,
        type: TrustVerificationType.ACTIVITY,
        status: TrustVerificationStatus.PENDING,
        documentType: "Prova de atividade",
        documentReference: input.activityReference,
      },
    });
  }

  const facialEnrollment = user.facialEnrollments[0];
  const faceStatus =
    facialEnrollment?.status === "APPROVED"
      ? TrustVerificationStatus.VERIFIED
      : facialEnrollment?.status === "REJECTED"
        ? TrustVerificationStatus.REJECTED
        : facialEnrollment
          ? TrustVerificationStatus.IN_REVIEW
          : TrustVerificationStatus.NOT_VERIFIED;
  const existingFaceRequest = await prisma.trustVerificationRequest.findFirst({
    where: {
      userId: input.userId,
      type: TrustVerificationType.FACE,
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (existingFaceRequest) {
    await prisma.trustVerificationRequest.update({
      where: { id: existingFaceRequest.id },
      data: {
        status: faceStatus,
        provider: facialEnrollment?.provider,
        providerReference: facialEnrollment?.storageKey,
        providerMetadata: facialEnrollment?.metadata as Prisma.InputJsonValue | undefined,
        reviewNotes: facialEnrollment?.reviewNotes ?? undefined,
      },
    });
  } else {
    await prisma.trustVerificationRequest.create({
      data: {
        ...commonData,
        type: TrustVerificationType.FACE,
        status: faceStatus,
        provider: facialEnrollment?.provider,
        providerReference: facialEnrollment?.storageKey,
        providerMetadata: facialEnrollment?.metadata as Prisma.InputJsonValue | undefined,
        reviewNotes: facialEnrollment?.reviewNotes ?? undefined,
      },
    });
  }

  if (input.requestBackgroundCheck) {
    const backgroundConsent = await prisma.consentRecord.create({
      data: {
        userId: input.userId,
        type: "BACKGROUND_CHECK",
        title: "Consentimento para verificação externa opcional",
        acceptedAt: new Date(),
        metadata: {
          providerIntegration: true,
        },
      },
    });

    const providerResult = await runOptionalBackgroundCheckProvider({
      userId: input.userId,
      consentAccepted: Boolean(input.consentBackground),
    });

    await prisma.trustVerificationRequest.create({
      data: {
        ...commonData,
        consentRecordId: backgroundConsent.id,
        type: TrustVerificationType.BACKGROUND_CHECK,
        status: providerResult.status,
        provider: providerResult.provider,
        providerReference: providerResult.reference,
        providerMetadata: providerResult.metadata as Prisma.InputJsonValue,
      },
    });
  }

  await prisma.trustVerificationRequest.create({
    data: {
      ...commonData,
      type: TrustVerificationType.ADMIN_REVIEW,
      status: TrustVerificationStatus.IN_REVIEW,
    },
  });

  await recomputeTrustProfileStatus(input.userId);

  return getTrustVerificationOverview(input.userId);
}

export async function reviewTrustVerificationRequest(input: {
  requestId: string;
  reviewerId: string;
  status: TrustVerificationStatus;
  reviewNotes?: string;
}) {
  const request = await prisma.trustVerificationRequest.findUnique({
    where: { id: input.requestId },
  });

  if (!request || request.deletedAt) {
    throw new Error("Solicitação de verificação não encontrada.");
  }

  await prisma.trustVerificationRequest.update({
    where: { id: input.requestId },
    data: {
      status: input.status,
      reviewedById: input.reviewerId,
      reviewedAt: new Date(),
      verifiedAt: input.status === "VERIFIED" ? new Date() : null,
      rejectedAt: input.status === "REJECTED" ? new Date() : null,
      reviewNotes: input.reviewNotes,
    },
  });

  if (request.workerProfileId) {
    const data: Prisma.WorkerProfileUpdateInput = {};

    if (request.type === "DOCUMENT") {
      data.identityDocumentStatus = input.status === "VERIFIED" ? "APPROVED" : input.status === "REJECTED" ? "REJECTED" : "PENDING";
    }

    if (request.type === "ADDRESS") {
      data.addressProofStatus = input.status === "VERIFIED" ? "APPROVED" : input.status === "REJECTED" ? "REJECTED" : "PENDING";
    }

    if (request.type === "ACTIVITY") {
      data.activityProofStatus = input.status === "VERIFIED" ? "APPROVED" : input.status === "REJECTED" ? "REJECTED" : "PENDING";
    }

    if (request.type === "PORTFOLIO") {
      data.portfolioProofStatus = input.status === "VERIFIED" ? "APPROVED" : input.status === "REJECTED" ? "REJECTED" : "PENDING";
    }

    if (request.type === "PHONE" && input.status === "VERIFIED") {
      data.phoneVerifiedAt = new Date();
    }

    if (Object.keys(data).length) {
      await prisma.workerProfile.update({
        where: { id: request.workerProfileId },
        data,
      });
    }
  }

  await recomputeTrustProfileStatus(request.userId);

  return getTrustVerificationOverview(request.userId);
}

export async function syncFacialTrustVerification(input: {
  userId: string;
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  provider?: string;
  providerReference?: string;
  providerMetadata?: Prisma.InputJsonValue;
  reviewNotes?: string;
}) {
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    include: {
      workerProfile: true,
      clientProfile: true,
    },
  });

  if (!user) return;

  const mappedStatus =
    input.status === "APPROVED"
      ? TrustVerificationStatus.VERIFIED
      : input.status === "REJECTED"
        ? TrustVerificationStatus.REJECTED
        : input.status === "IN_REVIEW"
          ? TrustVerificationStatus.IN_REVIEW
          : TrustVerificationStatus.PENDING;

  const existing = await prisma.trustVerificationRequest.findFirst({
    where: {
      userId: input.userId,
      type: TrustVerificationType.FACE,
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    await prisma.trustVerificationRequest.update({
      where: { id: existing.id },
      data: {
        status: mappedStatus,
        provider: input.provider,
        providerReference: input.providerReference,
        providerMetadata: input.providerMetadata,
        reviewNotes: input.reviewNotes,
        reviewedAt: mappedStatus === "IN_REVIEW" ? new Date() : existing.reviewedAt,
        verifiedAt: mappedStatus === "VERIFIED" ? new Date() : null,
        rejectedAt: mappedStatus === "REJECTED" ? new Date() : null,
      },
    });
  } else {
    await prisma.trustVerificationRequest.create({
      data: {
        userId: input.userId,
        workerProfileId: user.workerProfile?.id,
        clientProfileId: user.clientProfile?.id,
        type: TrustVerificationType.FACE,
        status: mappedStatus,
        provider: input.provider,
        providerReference: input.providerReference,
        providerMetadata: input.providerMetadata,
        reviewNotes: input.reviewNotes,
      },
    });
  }

  await recomputeTrustProfileStatus(input.userId);
}

export async function recomputeTrustProfileStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      workerProfile: {
        include: {
          portfolioImages: {
            where: { deletedAt: null },
          },
        },
      },
      clientProfile: true,
      trustVerifications: {
        where: { deletedAt: null },
      },
    },
  });

  if (!user) return;

  const statuses = user.trustVerifications.map((item) => item.status);
  const hasVerifiedDocument = user.trustVerifications.some((item) => item.type === "DOCUMENT" && item.status === "VERIFIED");
  const hasVerifiedAddress = user.trustVerifications.some((item) => item.type === "ADDRESS" && item.status === "VERIFIED");
  const hasVerifiedFace = user.trustVerifications.some((item) => item.type === "FACE" && item.status === "VERIFIED");
  const hasApprovedAdminReview = user.trustVerifications.some((item) => item.type === "ADMIN_REVIEW" && item.status === "VERIFIED");
  const hasVerifiedActivity =
    user.trustVerifications.some((item) => (item.type === "ACTIVITY" || item.type === "PORTFOLIO") && item.status === "VERIFIED") ||
    Boolean(user.workerProfile?.minimumPortfolioMet);
  const backgroundRequested = user.trustVerifications.some((item) => item.type === "BACKGROUND_CHECK");
  const backgroundPassedOrPending = !backgroundRequested || user.trustVerifications.some((item) => item.type === "BACKGROUND_CHECK" && (item.status === "VERIFIED" || item.status === "IN_REVIEW" || item.status === "PENDING"));

  let summary: TrustVerificationStatus = TrustVerificationStatus.NOT_VERIFIED;

  if (statuses.includes("REJECTED")) {
    summary = TrustVerificationStatus.REJECTED;
  } else if (statuses.includes("NEEDS_REVIEW")) {
    summary = TrustVerificationStatus.NEEDS_REVIEW;
  } else if (
    hasVerifiedDocument &&
    hasVerifiedFace &&
    hasApprovedAdminReview &&
    backgroundPassedOrPending &&
    (user.role !== UserRole.WORKER || (hasVerifiedAddress && hasVerifiedActivity))
  ) {
    summary = TrustVerificationStatus.VERIFIED;
  } else if (statuses.includes("IN_REVIEW")) {
    summary = TrustVerificationStatus.IN_REVIEW;
  } else if (statuses.includes("PENDING")) {
    summary = TrustVerificationStatus.PENDING;
  }

  const badgeEnabled = summary === TrustVerificationStatus.VERIFIED;

  if (user.workerProfile) {
    await prisma.workerProfile.update({
      where: { id: user.workerProfile.id },
      data: {
        trustVerificationStatus: summary,
        publicTrustBadgeEnabled: badgeEnabled,
        minimumPortfolioMet: user.workerProfile.portfolioImages.length >= 3,
      },
    });
  }

  if (user.clientProfile) {
    await prisma.clientProfile.update({
      where: { id: user.clientProfile.id },
      data: {
        trustVerificationStatus: summary,
        publicTrustBadgeEnabled: badgeEnabled,
      },
    });
  }
}

export async function getTrustVerificationOverview(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      workerProfile: true,
      clientProfile: true,
      trustVerifications: {
        where: { deletedAt: null },
        orderBy: [{ createdAt: "desc" }],
      },
    },
  });

  if (!user) {
    throw new Error("Conta não encontrada.");
  }

  const trustStatus = user.workerProfile?.trustVerificationStatus ?? user.clientProfile?.trustVerificationStatus ?? TrustVerificationStatus.NOT_VERIFIED;

  return {
    status: trustStatus,
    badgeEnabled: user.workerProfile?.publicTrustBadgeEnabled ?? user.clientProfile?.publicTrustBadgeEnabled ?? false,
    requests: user.trustVerifications.map((item) => ({
      id: item.id,
      type: item.type,
      status: item.status,
      submittedAt: item.submittedAt.toISOString(),
      reviewNotes: item.reviewNotes,
      provider: item.provider,
      documentType: item.documentType,
    })),
  };
}
