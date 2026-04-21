import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { getAppSession } from "@/lib/app-session";
import { getDashboardRouteByRole } from "@/lib/role-routing";

export default async function PostLoginPage() {
  const session = await getAppSession();

  if (!session?.user) {
    redirect(routes.login);
  }

  redirect(getDashboardRouteByRole(session.user.role));
}
