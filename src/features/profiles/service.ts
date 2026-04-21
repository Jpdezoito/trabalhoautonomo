import type { PublicWorkerProfile, ProfileCompletenessItem } from "@/features/profiles/types";

export function getProfileCompleteness(profile: PublicWorkerProfile): ProfileCompletenessItem[] {
  return [
    { key: "bio", label: "Descricao profissional", completed: profile.bio.length >= 40 },
    { key: "services", label: "Servicos cadastrados", completed: profile.services.length > 0 },
    { key: "portfolio", label: "Portfolio publicado", completed: profile.portfolio.length > 0 },
    { key: "reviews", label: "Avaliacoes publicas", completed: profile.reviews.length > 0 },
    { key: "whatsapp", label: "WhatsApp configurado", completed: profile.whatsapp.length > 0 },
  ];
}
