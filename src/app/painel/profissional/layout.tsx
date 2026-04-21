import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/app-session";

export default async function WorkerDashboardLayout({ children }: { children: ReactNode }) {
  const session = await getAppSession();

  if (!session || session.user.role !== "WORKER") {
    redirect("/entrar");
  }

  return children;
}
