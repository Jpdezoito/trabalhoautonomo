import { routes } from "@/config/routes";

export const publicNavigation = [
  { href: routes.home, label: "Inicio" },
  { href: routes.howItWorks, label: "Como funciona" },
  { href: routes.search, label: "Buscar profissionais" },
  { href: routes.categories, label: "Categorias" },
] as const;

export const clientNavigation = [
  { href: routes.clientDashboard, label: "Visao geral" },
  { href: routes.search, label: "Buscar profissionais" },
  { href: routes.clientFavorites, label: "Favoritos" },
  { href: routes.clientQuotes, label: "Orcamentos" },
  { href: routes.clientProfile, label: "Perfil" },
  { href: routes.clientPreferences, label: "Preferencias" },
  { href: routes.clientNotifications, label: "Notificacoes" },
  { href: routes.clientSettings, label: "Configuracoes" },
] as const;

export const workerNavigation = [
  { href: routes.workerDashboard, label: "Visao geral" },
  { href: routes.workerProfileSettings, label: "Perfil publico" },
  { href: routes.workerServices, label: "Servicos" },
  { href: routes.workerAvailability, label: "Disponibilidade" },
  { href: routes.workerPortfolio, label: "Portfolio" },
  { href: routes.workerQuotes, label: "Orcamentos" },
  { href: routes.workerReviews, label: "Avaliacoes" },
  { href: routes.workerNotifications, label: "Notificacoes" },
  { href: routes.workerSettings, label: "Configuracoes" },
] as const;

export const adminNavigation = [
  { href: routes.admin, label: "Visao geral" },
  { href: routes.adminUsers, label: "Usuarios" },
  { href: routes.adminClients, label: "Clientes" },
  { href: routes.adminCategories, label: "Categorias" },
  { href: routes.adminWorkers, label: "Profissionais" },
  { href: routes.adminQuotes, label: "Orcamentos" },
  { href: routes.adminReviews, label: "Avaliacoes" },
  { href: routes.adminModeration, label: "Moderacao" },
  { href: routes.adminVerification, label: "Verificacoes" },
  { href: routes.adminSettings, label: "Configuracoes" },
] as const;
