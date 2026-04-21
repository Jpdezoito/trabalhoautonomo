import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/app-session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAppSession();
  const role = session?.user?.role;

  if (!session || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    redirect("/entrar");
  }

  return children;
}
