import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { recoveryStartSchema, startPasswordRecovery } from "@/features/recovery";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = recoveryStartSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados inválidos." }, { status: 400 });
  }

  const headerList = await headers();
  const result = await startPasswordRecovery({
    method: parsed.data.method,
    identifier: parsed.data.identifier,
    ipAddress: headerList.get("x-forwarded-for"),
    userAgent: headerList.get("user-agent"),
  });

  return NextResponse.json(result);
}
