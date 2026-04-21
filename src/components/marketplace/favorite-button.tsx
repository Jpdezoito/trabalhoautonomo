"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAnonymousFavoriteKey } from "@/features/favorites";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  workerSlug: string;
  workerName: string;
  compact?: boolean;
  initialFavorited?: boolean;
  className?: string;
};

export function FavoriteButton({
  workerSlug,
  workerName,
  compact = false,
  initialFavorited = false,
  className,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(() => getStoredFavoriteState(workerSlug, initialFavorited));
  const [pending, setPending] = useState(false);

  useEffect(() => {
    function syncFavoriteState(event: StorageEvent) {
      if (event.key === getAnonymousFavoriteKey(workerSlug) && event.newValue) {
        setFavorited(event.newValue === "true");
      }
    }

    window.addEventListener("storage", syncFavoriteState);
    return () => window.removeEventListener("storage", syncFavoriteState);
  }, [workerSlug]);

  async function toggleFavorite() {
    const nextFavorited = !favorited;

    setFavorited(nextFavorited);
    setPending(true);
    window.localStorage.setItem(getAnonymousFavoriteKey(workerSlug), String(nextFavorited));

    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workerSlug,
        action: nextFavorited ? "add" : "remove",
      }),
    });

    if (response.status === 401) {
      window.location.href = "/entrar";
      return;
    }

    if (!response.ok) {
      setFavorited(!nextFavorited);
      window.localStorage.setItem(getAnonymousFavoriteKey(workerSlug), String(!nextFavorited));
    }

    setPending(false);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleFavorite}
        disabled={pending}
        className={cn(
          "h-fit shrink-0 rounded-[8px] border border-border bg-surface p-2 shadow-sm transition disabled:opacity-60",
          favorited ? "text-danger" : "text-muted hover:text-danger",
          className,
        )}
        aria-pressed={favorited}
        aria-label={favorited ? `Remover ${workerName} dos favoritos` : `Favoritar ${workerName}`}
      >
        <Heart className={cn(favorited && "fill-current")} size={18} />
      </button>
    );
  }

  return (
    <Button type="button" variant={favorited ? "danger" : "outline"} className={className} onClick={toggleFavorite} disabled={pending} aria-pressed={favorited}>
      <Heart className={cn("mr-2", favorited && "fill-current")} size={18} />
      {favorited ? "Favorito" : "Salvar nos favoritos"}
    </Button>
  );
}

function getStoredFavoriteState(workerSlug: string, fallback: boolean) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const storedValue = window.localStorage.getItem(getAnonymousFavoriteKey(workerSlug));
  return storedValue ? storedValue === "true" : fallback;
}
