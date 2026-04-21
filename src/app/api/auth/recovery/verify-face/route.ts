import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { recoveryVerifyFaceSchema, verifyRecoveryFaceFactor } from "@/features/recovery";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = recoveryVerifyFaceSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }

  try {
    const headerList = await headers();
    const result = await verifyRecoveryFaceFactor({
      sessionToken: parsed.data.sessionToken,
      imageDataUrl: parsed.data.imageDataUrl,
      ipAddress: headerList.get("x-forwarded-for"),
      userAgent: headerList.get("user-agent"),
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Falha na verificacao facial." }, { status: 400 });
  }
}
