import { randomUUID } from "node:crypto";
import { AccountStatus, UserRole, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Worker } from "@/types/marketplace";

export async function getOrCreateClientProfile(input: {
  email: string;
  name: string;
  phone?: string;
  city?: string;
  neighborhood?: string;
}) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { clientProfile: true },
  });

  const city = input.city
    ? await prisma.city.findFirst({
        where: { name: { equals: input.city, mode: "insensitive" } },
      })
    : null;

  const neighborhood =
    input.neighborhood && city
      ? await prisma.neighborhood.findFirst({
          where: {
            cityId: city.id,
            name: { equals: input.neighborhood, mode: "insensitive" },
          },
        })
      : null;

  if (existingUser?.clientProfile) {
    return existingUser.clientProfile;
  }

  if (existingUser && !existingUser.clientProfile) {
    return prisma.clientProfile.create({
      data: {
        userId: existingUser.id,
        cityId: city?.id,
        neighborhoodId: neighborhood?.id,
      },
    });
  }

  const createdUser = await prisma.user.create({
    data: {
      name: input.name,
      email: normalizedEmail,
      phone: input.phone,
      role: UserRole.CLIENT,
      status: AccountStatus.ACTIVE,
      clientProfile: {
        create: {
          cityId: city?.id,
          neighborhoodId: neighborhood?.id,
        },
      },
    },
    include: {
      clientProfile: true,
    },
  });

  if (!createdUser.clientProfile) {
    throw new Error("Nao foi possivel criar o perfil de cliente.");
  }

  return createdUser.clientProfile;
}

export async function findWorkerProfileBySlug(slug: string) {
  return prisma.workerProfile.findUnique({
    where: { slug },
  });
}

export async function findServiceByName(name: string) {
  return prisma.service.findFirst({
    where: {
      OR: [
        { name: { equals: name, mode: "insensitive" } },
        { slug: { equals: slugify(name), mode: "insensitive" } },
      ],
    },
  });
}

export function generateQuoteCode() {
  return `ORC-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export function mapFrontendQuoteStatusToPrisma(status: "OPEN" | "IN_CONTACT" | "ACCEPTED" | "DECLINED" | "COMPLETED") {
  if (status === "IN_CONTACT") return "IN_REVIEW";
  if (status === "ACCEPTED") return "ACCEPTED";
  if (status === "DECLINED") return "DECLINED";
  if (status === "COMPLETED") return "COMPLETED";

  return "OPEN";
}

export async function getFavoriteWorkersByClientUserId(userId: string) {
  const client = await prisma.clientProfile.findUnique({
    where: { userId },
    include: {
      favorites: {
        include: {
          workerProfile: {
            include: {
              user: true,
              city: true,
              neighborhood: true,
              qualifications: {
                where: { deletedAt: null },
                orderBy: [{ createdAt: "desc" }],
              },
              services: {
                include: {
                  service: {
                    include: {
                      category: true,
                    },
                  },
                },
              },
              portfolioImages: {
                where: { deletedAt: null },
                orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }],
                take: 2,
              },
              reviews: {
                where: { deletedAt: null, status: "PUBLISHED" },
                orderBy: { createdAt: "desc" },
                take: 3,
                include: {
                  clientProfile: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    client?.favorites.map((favorite) => mapWorkerProfileToMarketplaceWorker(favorite.workerProfile)) ?? []
  );
}

export function mapWorkerProfileToMarketplaceWorker(
  workerProfile: Prisma.WorkerProfileGetPayload<{
    include: {
      user: true;
      city: true;
      neighborhood: true;
      qualifications: true;
      services: { include: { service: { include: { category: true } } } };
      portfolioImages: true;
      reviews: { include: { clientProfile: { include: { user: true } } } };
    };
  }>,
): Worker {
  return {
    name: workerProfile.publicName,
    slug: workerProfile.slug,
    role: workerProfile.headline,
    headline: workerProfile.headline,
    bio: workerProfile.bio,
    city: workerProfile.city?.name ?? "Cidade nao informada",
    neighborhood: workerProfile.neighborhood?.name ?? "Bairro nao informado",
    rating: Number(workerProfile.averageRating),
    reviewsCount: workerProfile.reviewsCount,
    jobsDone: workerProfile.jobsCompleted,
    responseTime: "Responde em ate 24h",
    verified: workerProfile.verificationStatus === "APPROVED",
    available: workerProfile.isAvailable,
    plan: workerProfile.plan,
    image: workerProfile.user.image ?? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    coverImage:
      workerProfile.portfolioImages[0]?.imageUrl ??
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80",
    services: workerProfile.services.map((item) => item.service.name),
    categories: Array.from(new Set(workerProfile.services.map((item) => item.service.category.slug))),
    areas: [workerProfile.neighborhood?.name, workerProfile.city?.name].filter((value): value is string => Boolean(value)),
    yearsExperience: workerProfile.yearsExperience,
    whatsapp: workerProfile.whatsapp ?? "",
    phone: workerProfile.user.phone ?? "",
    startingPrice: workerProfile.basePriceDescription ?? "Sob consulta",
    contactSettings: {
      showWhatsapp: Boolean(workerProfile.whatsapp),
      showPhone: Boolean(workerProfile.user.phone),
      allowQuotes: true,
      allowShare: true,
    },
    identityVerification: {
      status: workerProfile.verificationStatus === "APPROVED" ? "aprovado" : workerProfile.verificationStatus === "REJECTED" ? "rejeitado" : "em_analise",
      retryCount: 0,
      recoveryEnabled: workerProfile.user.facialRecoveryEnabled,
    },
    trustVerification: {
      status:
        workerProfile.trustVerificationStatus === "VERIFIED"
          ? "verificado"
          : workerProfile.trustVerificationStatus === "REJECTED"
            ? "rejeitado"
            : workerProfile.trustVerificationStatus === "IN_REVIEW"
              ? "em_analise"
              : workerProfile.trustVerificationStatus === "PENDING"
                ? "pendente"
                : workerProfile.trustVerificationStatus === "NEEDS_REVIEW"
                  ? "revisao_necessaria"
                  : "nao_verificado",
      badgeEnabled: workerProfile.publicTrustBadgeEnabled,
      protectionLevel: workerProfile.publicTrustBadgeEnabled ? "reforcado" : "padrao",
    },
    trustSignals: [
      {
        label: "Identidade verificada",
        status: workerProfile.identityDocumentStatus === "APPROVED" ? "verificado" : workerProfile.identityDocumentStatus === "PENDING" ? "pendente" : "nao_informado",
      },
      {
        label: "Telefone verificado",
        status: workerProfile.phoneVerifiedAt ? "verificado" : workerProfile.user.phone ? "pendente" : "nao_informado",
      },
      {
        label: "Endereco verificado",
        status: workerProfile.addressProofStatus === "APPROVED" ? "verificado" : workerProfile.addressProofStatus === "PENDING" ? "pendente" : "nao_informado",
      },
      {
        label: "Verificacao facial concluida",
        status: workerProfile.verificationStatus === "APPROVED" ? "verificado" : workerProfile.verificationStatus === "PENDING" ? "pendente" : "nao_informado",
      },
      {
        label: "Portfolio verificado",
        status: workerProfile.portfolioProofStatus === "APPROVED" ? "verificado" : workerProfile.minimumPortfolioMet ? "pendente" : "nao_informado",
      },
      {
        label: "Experiencia comprovada",
        status: workerProfile.yearsExperience > 0 || workerProfile.experienceSummary ? "pendente" : "nao_informado",
      },
      {
        label: "Certificados enviados",
        status: workerProfile.qualifications.length ? "pendente" : "nao_informado",
      },
      {
        label: "Formacao informada",
        status: workerProfile.educationLevel || workerProfile.collegeName ? "pendente" : "nao_informado",
      },
    ],
    profileStrength: {
      educationLevel: workerProfile.educationLevel ?? undefined,
      collegeName: workerProfile.collegeName ?? undefined,
      licenseRegistrationNumber: workerProfile.licenseRegistration ?? undefined,
      meiNumber: workerProfile.meiNumber ?? undefined,
      companyName: workerProfile.companyName ?? undefined,
      companyDocument: workerProfile.companyDocument ?? undefined,
      experienceSummary: workerProfile.experienceSummary ?? undefined,
      qualifications: workerProfile.qualifications.map((item) => ({
        title: item.title,
        institution: item.institution ?? undefined,
        year: item.completionYear?.toString(),
        type: item.type,
        verified: item.status === "VERIFIED",
      })),
    },
    portfolio: workerProfile.portfolioImages.map((item) => ({
      title: item.title,
      description: item.description ?? "",
      image: item.imageUrl,
      city: workerProfile.city?.name ?? "Sao Paulo",
      verified: item.isVerifiedProof,
      workerVisible: item.workerVisible,
      evidenceLabel: item.evidenceType ? item.evidenceType.toLowerCase().replaceAll("_", " ") : "resultado final",
    })),
    reviews: workerProfile.reviews.map((review) => ({
      author: review.clientProfile.user.name,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      date: review.createdAt.toLocaleDateString("pt-BR"),
      status: review.status.toLowerCase() as "pending" | "published" | "hidden" | "rejected" | "flagged",
    })),
  };
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
