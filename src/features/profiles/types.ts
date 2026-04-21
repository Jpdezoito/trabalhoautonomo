import type { Worker } from "@/types/marketplace";

export type PublicWorkerProfile = Worker;

export type ProfileCompletenessItem = {
  key: string;
  label: string;
  completed: boolean;
};
