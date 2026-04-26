import { NextResponse } from "next/server";
import { z } from "zod";
import { findWorkerProfileBySlug } from "@/lib/marketplace-server";
import { prisma } from "@/lib/prisma";

const leadSchema = z.object({
  workerSlug: z.string().min(1),
  source: z.string().min(1).max(80),
  channel: z.enum(["WHATSAPP", "PHONE", "EMAIL", "PLATFORM"]).default("WHATSAPP"),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  referrer: z.string().optional(),
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Dados invalidos para registrar lead." }, { status: 422 });
  }

  const worker = await findWorkerProfileBySlug(parsed.data.workerSlug).catch(() => null);

  if (!worker) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  const lead = await prisma.lead.create({
    data: {
      workerProfileId: worker.id,
      channel: parsed.data.channel,
      source: parsed.data.source,
      city: parsed.data.city,
      neighborhood: parsed.data.neighborhood,
      referrer: parsed.data.referrer,
      userAgent: request.headers.get("user-agent"),
    },
  });

  return NextResponse.json({ ok: true, persisted: true, id: lead.id }, { status: 201 });
}
