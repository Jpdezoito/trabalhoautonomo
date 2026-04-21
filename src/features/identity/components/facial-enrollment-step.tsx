"use client";

import { FacialEnrollmentCard } from "@/features/identity/components/facial-enrollment-card";
import type { FacialEnrollmentDraft, IdentityAudience } from "@/features/identity/types";

export function FacialEnrollmentStep({
  audience,
  value,
  enabled = true,
  onChange,
}: {
  audience: IdentityAudience;
  value: FacialEnrollmentDraft;
  enabled?: boolean;
  onChange: (value: FacialEnrollmentDraft) => void;
}) {
  return (
    <FacialEnrollmentCard
      audience={audience}
      mode="draft"
      enabled={enabled}
      title="Verificacao facial"
      description="Registre sua captura facial com consentimento explicito para reforcar a verificacao de identidade e preparar a seguranca da conta."
      initialValue={value}
      onDraftChange={onChange}
    />
  );
}
