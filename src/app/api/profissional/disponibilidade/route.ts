import { NextResponse } from "next/server";
import { z } from "zod";
import { getAppSession } from "@/lib/app-session";
import { disableStaleWorkerAvailability } from "@/lib/availability";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  disponivel: z.boolean(),
});

export async function PATCH(request: Request) {
  const session = await getAppSession();

  if (!session?.user) {
    return NextResponse.json({ message: "Autenticacao obrigatoria." }, { status: 401 });
  }

  if (session.user.role !== "WORKER" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ message: "Perfil sem permissao para alterar disponibilidade." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Dados invalidos para disponibilidade." }, { status: 422 });
  }

  await disableStaleWorkerAvailability();

  const worker = await getWorkerProfileForSession(session.user.id, session.user.role);

  if (!worker) {
    return NextResponse.json({ message: "Perfil profissional nao encontrado." }, { status: 404 });
  }

  const updated = await prisma.workerProfile.update({
    where: { id: worker.id },
    data: {
      isAvailable: parsed.data.disponivel,
      ultimaAtividade: new Date(),
    },
    select: {
      isAvailable: true,
      ultimaAtividade: true,
    },
  });

  return NextResponse.json({
    disponivel: updated.isAvailable,
    ultimaAtividade: updated.ultimaAtividade.toISOString(),
  });
}

async function getWorkerProfileForSession(userId: string, role?: string) {
  const ownProfile = await prisma.workerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (ownProfile || process.env.NODE_ENV === "production") {
    return ownProfile;
  }

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return prisma.workerProfile.findFirst({
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });
  }

  return null;
}
