import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

type AppRole = "CLIENT" | "WORKER" | "ADMIN" | "SUPER_ADMIN";

const devSessionCookieName = "autonomopro-dev-session";

const routeRules: Array<{
  pattern: RegExp;
  roles: AppRole[];
}> = [
  { pattern: /^\/admin(?:\/|$)/, roles: ["ADMIN", "SUPER_ADMIN"] },
  { pattern: /^\/painel\/profissional(?:\/|$)/, roles: ["WORKER", "ADMIN", "SUPER_ADMIN"] },
  { pattern: /^\/painel\/cliente(?:\/|$)/, roles: ["CLIENT", "ADMIN", "SUPER_ADMIN"] },
  { pattern: /^\/api\/trust(?:\/|$)/, roles: ["CLIENT", "WORKER", "ADMIN", "SUPER_ADMIN"] },
  { pattern: /^\/api\/identity(?:\/|$)/, roles: ["CLIENT", "WORKER", "ADMIN", "SUPER_ADMIN"] },
  { pattern: /^\/api\/favorites(?:\/|$)/, roles: ["CLIENT", "ADMIN", "SUPER_ADMIN"] },
  { pattern: /^\/api\/profissional(?:\/|$)/, roles: ["WORKER", "ADMIN", "SUPER_ADMIN"] },
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const rule = routeRules.find((item) => item.pattern.test(pathname));

  if (!rule) {
    return NextResponse.next();
  }

  const role = await getRequestRole(request);

  if (!role) {
    return handleUnauthorized(request);
  }

  if (!rule.roles.includes(role)) {
    return handleForbidden(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/painel/cliente/:path*",
    "/painel/profissional/:path*",
    "/api/trust/:path*",
    "/api/identity/:path*",
    "/api/favorites/:path*",
    "/api/profissional/:path*",
  ],
};

async function getRequestRole(request: NextRequest): Promise<AppRole | null> {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (isAppRole(token?.role)) {
    return token.role;
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return getDevSessionRole(request);
}

function getDevSessionRole(request: NextRequest): AppRole | null {
  const raw = request.cookies.get(devSessionCookieName)?.value;

  if (!raw) {
    return null;
  }

  try {
    const json = base64UrlDecode(raw);
    const payload = JSON.parse(json) as { role?: unknown };

    return isAppRole(payload.role) ? payload.role : null;
  } catch {
    return null;
  }
}

function base64UrlDecode(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

  return atob(padded);
}

function isAppRole(value: unknown): value is AppRole {
  return value === "CLIENT" || value === "WORKER" || value === "ADMIN" || value === "SUPER_ADMIN";
}

function handleUnauthorized(request: NextRequest) {
  if (isApiRequest(request)) {
    return NextResponse.json({ message: "Autenticacao obrigatoria." }, { status: 401 });
  }

  const loginUrl = new URL("/entrar", request.url);
  loginUrl.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(loginUrl);
}

function handleForbidden(request: NextRequest) {
  if (isApiRequest(request)) {
    return NextResponse.json({ message: "Perfil sem permissao para acessar este recurso." }, { status: 403 });
  }

  return NextResponse.redirect(new URL("/pos-login", request.url));
}

function isApiRequest(request: NextRequest) {
  return request.nextUrl.pathname.startsWith("/api/");
}
