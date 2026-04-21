import { Socket } from "node:net";
import { prisma } from "@/lib/prisma";

function canReachLocalPostgres(port: number, host: string) {
  return new Promise<boolean>((resolve) => {
    const socket = new Socket();

    const finish = (result: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(800);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
    socket.connect(port, host);
  });
}

export async function getDevAuthStatus() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const databaseReachable = await canReachLocalPostgres(5432, "127.0.0.1");

  if (!databaseReachable) {
    return {
      databaseReachable: false,
      adminSeeded: false,
    };
  }

  try {
    const admin = await prisma.user.findUnique({
      where: { email: "admin@autonomopro.com.br" },
      select: { email: true, role: true },
    });

    return {
      databaseReachable: true,
      adminSeeded: Boolean(admin),
    };
  } catch {
    return {
      databaseReachable: true,
      adminSeeded: false,
    };
  }
}
