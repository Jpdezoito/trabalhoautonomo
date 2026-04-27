import { NextResponse } from "next/server";
import { disableStaleWorkerAvailability } from "@/lib/availability";

export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ message: "Nao autorizado." }, { status: 401 });
    }
  }

  const result = await disableStaleWorkerAvailability();

  return NextResponse.json({
    ok: true,
    disabled: result.count,
  });
}
