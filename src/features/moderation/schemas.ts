import { z } from "zod";

export const moderationDecisionSchema = z.object({
  entityId: z.string().min(1),
  decision: z.enum(["approve", "reject", "request_changes"]),
  notes: z.string().max(1000).optional(),
});

export const verificationReviewSchema = z.object({
  workerId: z.string().min(1),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  notes: z.string().max(1000).optional(),
});
