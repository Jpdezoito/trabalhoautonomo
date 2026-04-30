import { NextResponse } from "next/server";
import { z } from "zod";
import { getDevSessionCookieName, serializeDevSession } from "@/lib/app-session";

const schema = z.object({
  role: z.enum(["CLIENT", "WORKER", "ADMIN", "SUPER_ADMIN"]),
  name: z.string().min(2),
  email: z.string().email(),
});

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Recurso indisponivel em producao." }, { status: 404 });
  }

  const payload = await request.json();
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados inválidos." }, { status: 400 });
  }

  const response = NextResponse.json({
    ok: true,
    session: {
      mode: "dev-local",
      role: parsed.data.role,
    },
  });

  response.cookies.set(getDevSessionCookieName(), serializeDevSession({
    id: `dev-${parsed.data.role.toLowerCase()}`,
    name: parsed.data.name,
    email: parsed.data.email,
    role: parsed.data.role,
  }), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getDevSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 0,
  });
  return response;
}
