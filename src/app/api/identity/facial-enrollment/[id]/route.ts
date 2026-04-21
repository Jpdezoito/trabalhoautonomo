import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { facialEnrollmentReviewSchema, reviewFacialEnrollment } from "@/features/identity/service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Permissao administrativa necessaria." }, { status: 403 });
  }

  const payload = await request.json();
  const parsed = facialEnrollmentReviewSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }

  try {
    const params = await context.params;
    const summary = await reviewFacialEnrollment({
      enrollmentId: params.id,
      reviewerId: session.user.id,
      status: parsed.data.status,
      reviewNotes: parsed.data.reviewNotes,
    });

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Nao foi possivel revisar a verificacao facial." },
      { status: 400 },
    );
  }
}
