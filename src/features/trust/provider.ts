export async function runOptionalBackgroundCheckProvider(input: {
  userId: string;
  consentAccepted: boolean;
}) {
  if (!input.consentAccepted) {
    return {
      provider: "disabled",
      reference: undefined,
      status: "NEEDS_REVIEW" as const,
      metadata: {
        reason: "Consentimento ausente para verificacao externa.",
      },
    };
  }

  return {
    provider: "authorized-background-v1",
    reference: `bg-${input.userId.slice(0, 8)}`,
    status: "IN_REVIEW" as const,
    metadata: {
      lawfulIntegration: true,
      note: "Integracao externa opcional aguardando retorno do provedor autorizado.",
    },
  };
}
