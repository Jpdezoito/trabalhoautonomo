import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/app-session";

export default async function ClientDashboardLayout({ children }: { children: ReactNode }) {
  const session = await getAppSession();

  if (!session || session.user.role !== "CLIENT") {
    redirect("/entrar");
  }

  return children;
}
