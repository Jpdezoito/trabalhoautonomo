import { prisma } from "@/lib/prisma";

const staleAvailabilityHours = 48;

export function getAvailabilityCutoff(now = new Date()) {
  return new Date(now.getTime() - staleAvailabilityHours * 60 * 60 * 1000);
}

export function isAvailabilityFresh(lastActivityAt?: string | Date | null, now = new Date()) {
  if (!lastActivityAt) {
    return false;
  }

  return new Date(lastActivityAt).getTime() >= getAvailabilityCutoff(now).getTime();
}

export async function disableStaleWorkerAvailability(now = new Date()) {
  return prisma.workerProfile.updateMany({
    where: {
      isAvailable: true,
      ultimaAtividade: {
        lt: getAvailabilityCutoff(now),
      },
    },
    data: {
      isAvailable: false,
    },
  });
}
