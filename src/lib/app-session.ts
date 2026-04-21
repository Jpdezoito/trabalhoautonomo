import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import type { UserRole } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const devSessionCookieName = "autonomopro-dev-session";

export type AppSession = {
  mode: "next-auth" | "dev-local";
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: UserRole;
  };
};

type DevSessionPayload = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export async function getAppSession(): Promise<AppSession | null> {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return {
      mode: "next-auth",
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
    };
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const cookieStore = await cookies();
  const raw = cookieStore.get(devSessionCookieName)?.value;

  if (!raw) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as DevSessionPayload;

    if (!payload?.id || !payload?.role) {
      return null;
    }

    return {
      mode: "dev-local",
      user: payload,
    };
  } catch {
    return null;
  }
}

export function serializeDevSession(payload: DevSessionPayload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function getDevSessionCookieName() {
  return devSessionCookieName;
}
