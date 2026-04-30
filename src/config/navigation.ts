import { routes } from "@/config/routes";

export const publicNavigation = [
  { href: routes.home, label: "Inicio" },
  { href: routes.howItWorks, label: "Como funciona" },
  { href: routes.search, label: "Buscar profissionais" },
  { href: routes.categories, label: "Categorias" },
  { href: routes.plans, label: "Planos" },
] as const;

export const clientNavigation = [
  { href: routes.clientDashboard, label: "Visao geral" },
  { href: routes.search, label: "Buscar profissionais" },
  { href: routes.clientFavorites, label: "Favoritos" },
  { href: routes.clientQuotes, label: "Orçamentos" },
  { href: routes.clientProfile, label: "Perfil" },
  { href: routes.clientPreferences, label: "Preferências" },
  { href: routes.clientNotifications, label: "Notificações" },
  { href: routes.clientSettings, label: "Configurações" },
] as const;

export const workerNavigation = [
  { href: routes.workerDashboard, label: "Visao geral" },
  { href: routes.workerProfileSettings, label: "Perfil público" },
  { href: routes.workerServices, label: "Serviços" },
  { href: routes.workerAvailability, label: "Disponibilidade" },
  { href: routes.workerPortfolio, label: "Portfólio" },
  { href: routes.workerQuotes, label: "Orçamentos" },
  { href: routes.workerPlan, label: "Meu plano" },
  { href: routes.workerReviews, label: "Avaliações" },
  { href: routes.workerNotifications, label: "Notificações" },
  { href: routes.workerSettings, label: "Configurações" },
] as const;

export const adminNavigation = [
  { href: routes.admin, label: "Visao geral" },
  { href: routes.adminUsers, label: "Usuários" },
  { href: routes.adminClients, label: "Clientes" },
  { href: routes.adminCategories, label: "Categorias" },
  { href: routes.adminWorkers, label: "Profissionais" },
  { href: routes.adminQuotes, label: "Orçamentos" },
  { href: routes.adminReviews, label: "Avaliações" },
  { href: routes.adminModeration, label: "Moderação" },
  { href: routes.adminVerification, label: "Verificacoes" },
  { href: routes.adminSettings, label: "Configurações" },
] as const;
