import { NextResponse } from "next/server";
import { reviewSchema } from "@/features/reviews";
import { findWorkerProfileBySlug, getOrCreateClientProfile } from "@/lib/marketplace-server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = reviewSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Dados inválidos para enviar avaliação.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const worker = await findWorkerProfileBySlug(parsed.data.workerSlug);

  if (!worker) {
    return NextResponse.json({ message: "Profissional não encontrado." }, { status: 404 });
  }

  const clientProfile = parsed.data.email
    ? await getOrCreateClientProfile({
        email: parsed.data.email,
        name: parsed.data.author?.trim() || "Cliente verificado",
      })
    : null;

  const review = await prisma.review.create({
    data: {
      workerProfileId: worker.id,
      clientProfileId: clientProfile?.id,
      clienteNome: parsed.data.author?.trim() || null,
      clienteEmail: parsed.data.email?.trim().toLowerCase() || null,
      mostrarNome: Boolean(parsed.data.showName && parsed.data.author?.trim()),
      rating: parsed.data.rating,
      title: parsed.data.title,
      comment: parsed.data.comment,
      status: "PENDING",
    },
  });

  return NextResponse.json(
    {
      message: "Avaliação enviada. Ela será publicada após revisão da moderação.",
      id: review.id,
      status: review.status.toLowerCase(),
    },
    { status: 201 },
  );
}
