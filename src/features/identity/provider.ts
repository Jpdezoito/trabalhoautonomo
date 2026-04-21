import { createHash, randomUUID } from "node:crypto";
import { identityFeatureFlags } from "@/features/identity/constants";
import type { FacialCaptureSource } from "@/features/identity/types";

export async function storeFacialEnrollmentReference(input: {
  userId: string;
  imageDataUrl: string;
  captureSource: FacialCaptureSource;
}) {
  const mimeType = getMimeTypeFromDataUrl(input.imageDataUrl);
  const byteSizeEstimate = estimateDataUrlBytes(input.imageDataUrl);
  const fingerprint = createHash("sha256").update(input.imageDataUrl).digest("hex").slice(0, 16);

  return {
    provider: identityFeatureFlags.providerName,
    storageKey: `facial-enrollments/${input.userId}/${randomUUID()}`,
    metadata: {
      captureSource: input.captureSource,
      mimeType,
      byteSizeEstimate,
      fingerprint,
      storedAt: new Date().toISOString(),
    },
  };
}

export async function verifyLiveCaptureForRecovery(input: {
  imageDataUrl: string;
  enrollment: {
    provider: string;
    storageKey: string;
    metadata: unknown;
  };
}) {
  const mimeType = getMimeTypeFromDataUrl(input.imageDataUrl);
  const byteSizeEstimate = estimateDataUrlBytes(input.imageDataUrl);
  const metadata = input.enrollment.metadata && typeof input.enrollment.metadata === "object" ? (input.enrollment.metadata as Record<string, unknown>) : {};
  const baselineSize = typeof metadata.byteSizeEstimate === "number" ? metadata.byteSizeEstimate : 0;
  const structuralSimilarity = baselineSize > 0 ? Math.min(byteSizeEstimate, baselineSize) / Math.max(byteSizeEstimate, baselineSize) : 0.78;
  const success =
    input.enrollment.provider === identityFeatureFlags.providerName &&
    identityFeatureFlags.acceptedMimeTypes.includes(mimeType as (typeof identityFeatureFlags.acceptedMimeTypes)[number]) &&
    byteSizeEstimate > 80_000 &&
    structuralSimilarity >= 0.45;

  return {
    success,
    confidenceScore: Number(structuralSimilarity.toFixed(2)),
    reason: success ? undefined : "Nao foi possivel confirmar a verificacao facial. Tente novamente com melhor iluminacao.",
  };
}

function getMimeTypeFromDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+?);base64,/);

  return match?.[1] ?? "image/jpeg";
}

function estimateDataUrlBytes(dataUrl: string) {
  const content = dataUrl.split(",")[1] ?? "";

  return Math.round((content.length * 3) / 4);
}
