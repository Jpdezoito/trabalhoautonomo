export type ManagedPortfolioItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  city?: string;
  completedAt?: string;
  sortOrder: number;
  isFeatured: boolean;
};
