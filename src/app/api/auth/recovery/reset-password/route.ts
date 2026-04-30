import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { recoveryResetPasswordSchema, resetPasswordAfterRecovery } from "@/features/recovery";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = recoveryResetPasswordSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados inválidos." }, { status: 400 });
  }

  try {
    const headerList = await headers();
    const result = await resetPasswordAfterRecovery({
      sessionToken: parsed.data.sessionToken,
      password: parsed.data.password,
      ipAddress: headerList.get("x-forwarded-for"),
      userAgent: headerList.get("user-agent"),
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível redefinir a senha." }, { status: 400 });
  }
}
