import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { favoriteSchema } from "@/features/favorites";
import { authOptions } from "@/lib/auth";
import { findWorkerProfileBySlug } from "@/lib/marketplace-server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "CLIENT") {
    return NextResponse.json({ message: "Entre como cliente para salvar favoritos." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = favoriteSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Dados inválidos para atualizar favoritos.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const [worker, clientProfile] = await Promise.all([
    findWorkerProfileBySlug(parsed.data.workerSlug),
    prisma.clientProfile.findUnique({ where: { userId: session.user.id } }),
  ]);

  if (!worker || !clientProfile) {
    return NextResponse.json({ message: "Profissional não encontrado." }, { status: 404 });
  }

  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      clientProfileId_workerProfileId: {
        clientProfileId: clientProfile.id,
        workerProfileId: worker.id,
      },
    },
  });

  const shouldFavorite = parsed.data.action === "add" || (parsed.data.action === "toggle" && !existingFavorite);

  if (shouldFavorite && !existingFavorite) {
    await prisma.favorite.create({
      data: {
        clientProfileId: clientProfile.id,
        workerProfileId: worker.id,
      },
    });
  }

  if (!shouldFavorite && existingFavorite) {
    await prisma.favorite.delete({
      where: {
        clientProfileId_workerProfileId: {
          clientProfileId: clientProfile.id,
          workerProfileId: worker.id,
        },
      },
    });
  }

  return NextResponse.json({
    message: shouldFavorite ? "Profissional salvo nos favoritos." : "Profissional removido dos favoritos.",
    workerSlug: parsed.data.workerSlug,
    favorited: shouldFavorite,
  });
}
