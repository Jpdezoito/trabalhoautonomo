import type { PublicWorkerProfile, ProfileCompletenessItem } from "@/features/profiles/types";

export function getProfileCompleteness(profile: PublicWorkerProfile): ProfileCompletenessItem[] {
  return [
    { key: "bio", label: "Descrição profissional", completed: profile.bio.length >= 40 },
    { key: "services", label: "Serviços cadastrados", completed: profile.services.length > 0 },
    { key: "portfolio", label: "Portfólio publicado", completed: profile.portfolio.length > 0 },
    { key: "reviews", label: "Avaliações públicas", completed: profile.reviews.length > 0 },
    { key: "whatsapp", label: "WhatsApp configurado", completed: profile.whatsapp.length > 0 },
  ];
}
