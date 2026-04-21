import { z } from "zod";

export const platformSettingsSchema = z.object({
  platformName: z.string().min(2),
  quoteResponseTargetHours: z.coerce.number().int().positive(),
  requireProfileModeration: z.boolean(),
  enableWhatsappContact: z.boolean(),
});
