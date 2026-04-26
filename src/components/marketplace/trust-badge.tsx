import { BadgeCheck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Worker } from "@/types/marketplace";

export function TrustBadge({ worker, compact = false }: { worker: Worker; compact?: boolean }) {
  const verified = worker.trustVerification?.status === "verificado" || worker.verified;

  if (!verified) {
    return null;
  }

  return (
    <Badge variant="success" title="Identidade analisada pela plataforma. Documentos sensiveis nao sao exibidos publicamente.">
      {compact ? <BadgeCheck size={14} /> : <ShieldCheck size={14} />}
      {compact ? "Verificado" : "Verificado AutonomoPro"}
    </Badge>
  );
}

export function PlanBadge({ plan }: { plan?: Worker["plan"] }) {
  if (plan === "DESTAQUE") {
    return <Badge variant="warning">Destaque no bairro</Badge>;
  }

  if (plan === "PRO") {
    return <Badge variant="info">Plano Pro</Badge>;
  }

  return null;
}
