import { NextResponse } from "next/server";
import { quoteRequestSchema } from "@/features/quotes/schemas";
import { findServiceByName, findWorkerProfileBySlug, generateQuoteCode, getOrCreateClientProfile } from "@/lib/marketplace-server";
import { prisma } from "@/lib/prisma";
import { estimateQuotePrice } from "@/lib/quote-pricing";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = quoteRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Dados invalidos para solicitar orcamento.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const workerSlug = parsed.data.workerSlug ?? parsed.data.workerId;
  const worker = await findWorkerProfileBySlug(workerSlug);

  if (!worker) {
    return NextResponse.json({ message: "Profissional nao encontrado." }, { status: 404 });
  }

  const clientProfile = await getOrCreateClientProfile({
    email: parsed.data.clientEmail,
    name: parsed.data.clientName,
    phone: parsed.data.clientPhone,
    city: parsed.data.city,
    neighborhood: parsed.data.neighborhood,
  });

  const [city, neighborhood, service] = await Promise.all([
    prisma.city.findFirst({
      where: { name: { equals: parsed.data.city, mode: "insensitive" } },
    }),
    prisma.neighborhood.findFirst({
      where: { name: { equals: parsed.data.neighborhood, mode: "insensitive" } },
    }),
    findServiceByName(parsed.data.serviceType),
  ]);
  const estimate = estimateQuotePrice({
    serviceType: parsed.data.serviceType,
    description: parsed.data.description,
    city: parsed.data.city,
    neighborhood: parsed.data.neighborhood,
    workerStartingPrice: worker.basePriceDescription,
  });

  const quote = await prisma.quoteRequest.create({
    data: {
      code: generateQuoteCode(),
      clientProfileId: clientProfile.id,
      workerProfileId: worker.id,
      serviceId: service?.id,
      cityId: city?.id,
      neighborhoodId: neighborhood?.id,
      title: parsed.data.serviceType,
      description: parsed.data.description,
      preferredDate: parsed.data.preferredDate ? new Date(parsed.data.preferredDate) : null,
      budgetMin: parsed.data.budgetMin,
      budgetMax: parsed.data.budgetMax,
      platformEstimateMin: estimate.min,
      platformEstimateMax: estimate.max,
      platformFeePercent: estimate.platformFeePercent,
      platformFeeAmount: estimate.platformFeeAmount,
      professionalNetMin: estimate.professionalNetMin,
      professionalNetMax: estimate.professionalNetMax,
      status: "OPEN",
      priority: "NORMAL",
    },
  });

  return NextResponse.json(
    {
      message: "Pedido de orcamento recebido.",
      id: quote.id,
      code: quote.code,
      status: quote.status,
      estimate,
    },
    { status: 201 },
  );
}
