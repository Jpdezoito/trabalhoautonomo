import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { trustVerificationRequestSchema } from "@/features/trust";
import { createTrustVerificationFlow } from "@/features/trust/service";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json({ error: "Autenticação necessaria." }, { status: 401 });
  }

  if (session.user.role !== "WORKER" && session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "Perfil sem permissão para verificação." }, { status: 403 });
  }

  const payload = await request.json();
  const parsed = trustVerificationRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados inválidos." }, { status: 400 });
  }

  try {
    const overview = await createTrustVerificationFlow({
      userId: session.user.id,
      role: session.user.role,
      documentType: parsed.data.documentType,
      documentReference: parsed.data.documentReference,
      addressReference: parsed.data.addressReference,
      activityReference: parsed.data.activityReference,
      consentIdentity: parsed.data.consentIdentity,
      consentBackground: parsed.data.consentBackground,
      requestBackgroundCheck: parsed.data.requestBackgroundCheck,
    });

    return NextResponse.json({ overview });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível iniciar a verificação." }, { status: 400 });
  }
}
