import type { Category, Worker } from "@/types/marketplace";

export type CategoryPageContent = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  highlights: string[];
  commonServices: string[];
  whenToHire: string[];
};

export type CategoryWithContent = Category & {
  content: CategoryPageContent;
  workers: Worker[];
};
