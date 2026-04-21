import { publicCategories, quotes, workers } from "@/lib/marketplace-data";

export const adminUsers = [
  { id: "USR-1001", name: "Mariana Almeida", role: "Cliente", email: "mariana@email.com", status: "Ativo", city: "Sao Paulo" },
  { id: "USR-1002", name: "Carlos Mendes", role: "Profissional", email: "carlos@email.com", status: "Ativo", city: "Sao Paulo" },
  { id: "USR-1003", name: "Fernanda Rocha", role: "Profissional", email: "fernanda@email.com", status: "Ativo", city: "Sao Paulo" },
  { id: "USR-1004", name: "Equipe Operacional", role: "Admin", email: "admin@autonomopro.com.br", status: "Ativo", city: "Sao Paulo" },
] as const;

export const verificationQueue = workers.map((worker, index) => ({
  id: `VER-${index + 1}`,
  workerSlug: worker.slug,
  workerName: worker.name,
  category: worker.role,
  city: worker.city,
  status: worker.identityVerification?.status === "aprovado" ? "approved" : worker.identityVerification?.status === "rejeitado" ? "rejected" : "pending",
  captureSource: worker.identityVerification?.captureSource ?? (index % 2 === 0 ? "webcam" : "upload"),
  retryCount: worker.identityVerification?.retryCount ?? index,
  submittedAt: index % 2 === 0 ? "18 abr 2026" : "19 abr 2026",
}));

export const moderationCases = [
  {
    id: "MOD-101",
    target: "Avaliacao publica",
    reason: "Possivel conteudo ofensivo",
    queue: "reviews",
    status: "open",
    detail: "Comentario sinalizado por linguagem inadequada.",
  },
  {
    id: "MOD-102",
    target: "Perfil profissional",
    reason: "Documento pendente",
    queue: "profiles",
    status: "in_review",
    detail: "Solicitada nova documentacao antes da aprovacao.",
  },
  {
    id: "MOD-103",
    target: "Imagem de portfolio",
    reason: "Qualidade insuficiente",
    queue: "portfolio",
    status: "action_required",
    detail: "Imagem precisa ser substituida por foto mais nítida.",
  },
] as const;

export const adminActivity = [
  { label: "Usuarios totais", value: "2.846", detail: "Clientes, profissionais e administradores.", tone: "default" },
  { label: "Profissionais ativos", value: String(workers.length), detail: "Perfis mockados com dados publicos.", tone: "success" },
  { label: "Categorias ativas", value: String(publicCategories.length), detail: "Catalogo amplo com grupos e subcategorias.", tone: "info" },
  { label: "Orcamentos em aberto", value: String(quotes.length), detail: "Pedidos acompanhados pela operacao.", tone: "warning" },
] as const;
