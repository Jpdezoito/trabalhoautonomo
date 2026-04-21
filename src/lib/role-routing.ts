import type { UserRole } from "@prisma/client";
import { routes } from "@/config/routes";

export function getDashboardRouteByRole(role?: UserRole) {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return routes.admin;
  }

  if (role === "WORKER") {
    return routes.workerDashboard;
  }

  return routes.clientDashboard;
}

export function getSettingsRouteByRole(role?: UserRole) {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return routes.adminSettings;
  }

  if (role === "WORKER") {
    return routes.workerSettings;
  }

  return routes.clientSettings;
}
