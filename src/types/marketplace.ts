import type { LucideIcon } from "lucide-react";

export type AccountRole = "cliente" | "profissional" | "admin";

export type Category = {
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  professionals: number;
  group?: string;
  parentSlug?: string;
  subcategories?: string[];
};

export type PortfolioItem = {
  title: string;
  description: string;
  image: string;
  city: string;
  verified?: boolean;
  workerVisible?: boolean;
  evidenceLabel?: string;
};

export type ReviewStatus = "pending" | "published" | "hidden" | "rejected" | "flagged";

export type WorkerContactSettings = {
  showWhatsapp?: boolean;
  showPhone?: boolean;
  allowQuotes?: boolean;
  allowShare?: boolean;
};

export type ProfessionalPlan = "FREE" | "PRO" | "DESTAQUE";

export type Review = {
  author?: string;
  email?: string;
  showName?: boolean;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status?: ReviewStatus;
  workerSlug?: string;
  workerName?: string;
};

export type IdentityVerificationSummary = {
  status: "pendente" | "em_analise" | "aprovado" | "rejeitado";
  retryCount?: number;
  recoveryEnabled?: boolean;
  captureSource?: "webcam" | "upload";
  submittedAt?: string;
  reviewNotes?: string;
};

export type TrustVerificationSummary = {
  status: "nao_verificado" | "pendente" | "em_analise" | "verificado" | "rejeitado" | "revisao_necessaria";
  badgeEnabled?: boolean;
  protectionLevel?: "padrao" | "reforcado";
};

export type TrustSignal = {
  label: string;
  status: "verificado" | "pendente" | "nao_informado";
};

export type WorkerQualification = {
  title: string;
  institution?: string;
  year?: string;
  type?: string;
  verified?: boolean;
};

export type WorkerProfileStrength = {
  educationLevel?: string;
  courseSummary?: string;
  collegeName?: string;
  licenseRegistrationNumber?: string;
  meiNumber?: string;
  companyName?: string;
  companyDocument?: string;
  experienceSummary?: string;
  qualifications?: WorkerQualification[];
};

export type Worker = {
  name: string;
  slug: string;
  role: string;
  headline: string;
  bio: string;
  city: string;
  neighborhood: string;
  rating: number;
  reviewsCount: number;
  jobsDone: number;
  responseTime: string;
  verified: boolean;
  available: boolean;
  lastActivityAt?: string;
  plan?: ProfessionalPlan;
  image: string;
  coverImage: string;
  services: string[];
  categories: string[];
  areas: string[];
  yearsExperience: number;
  whatsapp: string;
  phone?: string;
  startingPrice: string;
  contactSettings?: WorkerContactSettings;
  identityVerification?: IdentityVerificationSummary;
  trustVerification?: TrustVerificationSummary;
  trustSignals?: TrustSignal[];
  profileStrength?: WorkerProfileStrength;
  portfolio: PortfolioItem[];
  reviews: Review[];
};

export type Quote = {
  id: string;
  service: string;
  worker: string;
  client: string;
  location: string;
  status: "Aberto" | "Respondido" | "Aprovado" | "Concluido";
  value?: string;
  createdAt: string;
};
