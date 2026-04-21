export type FavoriteTarget = {
  userId: string;
  workerSlug: string;
};

export type FavoriteAction = "add" | "remove" | "toggle";
