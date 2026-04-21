import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createFacialEnrollmentForUser, facialEnrollmentRequestSchema } from "@/features/identity/service";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json({ error: "Autenticacao necessaria." }, { status: 401 });
  }

  if (session.user.role !== "WORKER" && session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "Perfil sem permissao para verificacao facial." }, { status: 403 });
  }

  const payload = await request.json();
  const parsed = facialEnrollmentRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }

  try {
    const summary = await createFacialEnrollmentForUser({
      userId: session.user.id,
      role: session.user.role,
      imageDataUrl: parsed.data.imageDataUrl,
      captureSource: parsed.data.captureSource,
      consentAccepted: true,
    });

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Nao foi possivel registrar a verificacao facial." },
      { status: 400 },
    );
  }
}
