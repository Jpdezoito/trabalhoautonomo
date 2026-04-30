import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { trustVerificationReviewSchema } from "@/features/trust";
import { reviewTrustVerificationRequest } from "@/features/trust/service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Permissão administrativa necessaria." }, { status: 403 });
  }

  const payload = await request.json();
  const parsed = trustVerificationReviewSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados inválidos." }, { status: 400 });
  }

  try {
    const params = await context.params;
    const overview = await reviewTrustVerificationRequest({
      requestId: params.id,
      reviewerId: session.user.id,
      status: parsed.data.status,
      reviewNotes: parsed.data.reviewNotes,
    });

    return NextResponse.json({ overview });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível revisar a solicitação." }, { status: 400 });
  }
}
