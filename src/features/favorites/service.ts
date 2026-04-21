import type { FavoriteTarget } from "@/features/favorites/types";

export function getFavoriteKey(target: FavoriteTarget) {
  return `${target.userId}:${target.workerSlug}`;
}

export function getAnonymousFavoriteKey(workerSlug: string) {
  return `autonomopro.favorite.${workerSlug}`;
}

export function getNextFavoriteState(current: boolean, action: "add" | "remove" | "toggle") {
  if (action === "add") return true;
  if (action === "remove") return false;

  return !current;
}
