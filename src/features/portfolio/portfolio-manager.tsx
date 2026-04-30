"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Save, Star, Trash2, UploadCloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldHint, Input, Label, Textarea } from "@/components/ui/form";
import { portfolioDraftItemSchema, portfolioImageFileSchema } from "@/features/portfolio/schemas";
import type { ManagedPortfolioItem } from "@/features/portfolio/types";
import { cn } from "@/lib/utils";

const storageKey = "autonomopro.worker-portfolio-draft";

type PortfolioManagerProps = {
  initialItems: ManagedPortfolioItem[];
};

export function PortfolioManager({ initialItems }: PortfolioManagerProps) {
  const [items, setItems] = useState<ManagedPortfolioItem[]>(() => loadInitialItems(initialItems));
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Rascunho carregado");

  const orderedItems = useMemo(() => [...items].sort((a, b) => a.sortOrder - b.sortOrder), [items]);
  const featuredItem = orderedItems.find((item) => item.isFeatured);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  function addItem() {
    const nextItem: ManagedPortfolioItem = {
      id: crypto.randomUUID(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      imageUrl: draft.imageUrl,
      sortOrder: items.length,
      isFeatured: items.length === 0,
    };

    const validation = portfolioDraftItemSchema.safeParse(nextItem);

    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Revise os dados do portfólio.");
      return;
    }

    setItems((current) => normalizeOrder([...current, nextItem]));
    setDraft({ title: "", description: "", imageUrl: "" });
    setError("");
    setStatus("Item adicionado ao portfólio");
  }

  function removeItem(id: string) {
    setItems((current) => {
      const nextItems = current.filter((item) => item.id !== id);
      const hadFeatured = current.find((item) => item.id === id)?.isFeatured;
      const normalized = normalizeOrder(nextItems);

      if (hadFeatured && normalized.length) {
        return normalized.map((item, index) => ({ ...item, isFeatured: index === 0 }));
      }

      return normalized;
    });
    setStatus("Item removido");
  }

  function moveItem(id: string, direction: "up" | "down") {
    const currentIndex = orderedItems.findIndex((item) => item.id === id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedItems.length) {
      return;
    }

    const nextItems = [...orderedItems];
    const [item] = nextItems.splice(currentIndex, 1);
    nextItems.splice(targetIndex, 0, item);
    setItems(normalizeOrder(nextItems));
    setStatus("Ordem atualizada");
  }

  function markFeatured(id: string) {
    setItems((current) => current.map((item) => ({ ...item, isFeatured: item.id === id })));
    setStatus("Item destacado atualizado");
  }

  function saveDraft() {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
    setStatus("Portfólio salvo neste navegador");
  }

  async function handleImage(file?: File) {
    if (!file) {
      return;
    }

    const validation = portfolioImageFileSchema.safeParse(file);

    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Imagem inválida.");
      return;
    }

    const imageUrl = await fileToDataUrl(file);
    setDraft((current) => ({ ...current, imageUrl }));
    setError("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="grid min-w-0 gap-6">
        <Card variant="elevated">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Adicionar item ao portfólio</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Envie imagens reais dos seus trabalhos. Use titulos claros e descricoes objetivas.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={saveDraft}>
                <Save className="mr-2" size={18} />
                Salvar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
              <label className="relative grid min-h-64 cursor-pointer place-items-center overflow-hidden rounded-[8px] border border-dashed border-border-strong bg-surface-muted p-4 text-center">
                {draft.imageUrl ? <Image src={draft.imageUrl} alt="" fill sizes="260px" className="object-cover" /> : null}
                <input type="file" accept="image/*" className="sr-only" onChange={(event) => void handleImage(event.target.files?.[0])} />
                <span className={cn("relative z-10 rounded-[8px] bg-surface/92 p-4 shadow-[var(--shadow-sm)]", draft.imageUrl && "backdrop-blur")}>
                  <UploadCloud className="mx-auto text-primary" size={30} />
                  <span className="mt-3 block font-black text-foreground">Enviar imagem</span>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-muted">PNG, JPG ou WEBP ate 3 MB.</span>
                </span>
              </label>

              <div className="grid gap-4">
                <Field>
                  <Label>Titulo</Label>
                  <Input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Ex.: Reforma de banheiro completa" />
                </Field>
                <Field>
                  <Label>Descrição</Label>
                  <Textarea
                    value={draft.description}
                    onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Explique o que foi feito, materiais, prazo ou resultado final."
                  />
                  <FieldHint>{draft.description.length}/500 caracteres</FieldHint>
                </Field>
                {error ? <p className="rounded-[8px] bg-danger-soft p-3 text-sm font-bold text-danger">{error}</p> : null}
                <Button type="button" onClick={addItem}>
                  <ImagePlus className="mr-2" size={18} />
                  Adicionar ao portfólio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Itens publicados</CardTitle>
                <p className="mt-2 text-sm text-muted">Reordene, destaque ou remova trabalhos do seu portfólio.</p>
              </div>
              <Badge variant={orderedItems.length ? "primary" : "neutral"}>{orderedItems.length} item{orderedItems.length === 1 ? "" : "s"}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {orderedItems.length ? (
              <div className="grid gap-4">
                {orderedItems.map((item, index) => (
                  <PortfolioRow
                    key={item.id}
                    item={item}
                    index={index}
                    total={orderedItems.length}
                    onMove={moveItem}
                    onRemove={removeItem}
                    onFeature={markFeatured}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[8px] border border-dashed border-border-strong bg-surface p-8 text-center">
                <ImagePlus className="mx-auto text-muted" size={36} />
                <h2 className="mt-4 text-2xl font-black text-foreground">Seu portfólio ainda está vazio</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                  Adicione pelo menos um trabalho para aumentar a confiança no seu perfil público.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <aside className="grid gap-4 lg:sticky lg:top-24 lg:h-fit">
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <SummaryLine label="Itens" value={orderedItems.length.toString()} />
              <SummaryLine label="Destaque" value={featuredItem?.title ?? "Nenhum"} />
              <SummaryLine label="Status" value={status} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Boas praticas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 text-sm leading-6 text-muted">
              <li>Use fotos nitidas, sem marca d&após;agua pesada.</li>
              <li>Mostre antes e depois quando fizer sentido.</li>
              <li>Priorize trabalhos que provem sua especialidade.</li>
              <li>Marque como destaque o projeto mais forte.</li>
            </ul>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function PortfolioRow({
  item,
  index,
  total,
  onMove,
  onRemove,
  onFeature,
}: {
  item: ManagedPortfolioItem;
  index: number;
  total: number;
  onMove: (id: string, direction: "up" | "down") => void;
  onRemove: (id: string) => void;
  onFeature: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 rounded-[8px] border border-border bg-surface p-4 md:grid-cols-[160px_minmax(0,1fr)_auto]">
      <div className="relative min-h-36 overflow-hidden rounded-[8px] bg-surface-muted">
        <Image src={item.imageUrl} alt={item.title} fill sizes="160px" className="object-cover" />
        {item.isFeatured ? <Badge variant="warning" className="absolute left-2 top-2">Destaque</Badge> : null}
      </div>
      <div className="min-w-0">
        <h3 className="text-lg font-black text-foreground">{item.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{item.description || "Sem descrição informada."}</p>
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-primary">Posicao {index + 1}</p>
      </div>
      <div className="flex flex-row gap-2 md:flex-col">
        <Button type="button" variant="outline" size="sm" onClick={() => onMove(item.id, "up")} disabled={index === 0}>
          <ArrowUp size={16} />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => onMove(item.id, "down")} disabled={index === total - 1}>
          <ArrowDown size={16} />
        </Button>
        <Button type="button" variant={item.isFeatured ? "secondary" : "outline"} size="sm" onClick={() => onFeature(item.id)}>
          <Star size={16} />
        </Button>
        <Button type="button" variant="danger" size="sm" onClick={() => onRemove(item.id)}>
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-surface-muted p-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 font-black text-foreground">{value}</p>
    </div>
  );
}

function normalizeOrder(items: ManagedPortfolioItem[]) {
  return items.map((item, index) => ({ ...item, sortOrder: index }));
}

function loadInitialItems(initialItems: ManagedPortfolioItem[]) {
  if (typeof window === "undefined") {
    return initialItems;
  }

  const stored = window.localStorage.getItem(storageKey);

  if (!stored) {
    return initialItems;
  }

  try {
    return JSON.parse(stored) as ManagedPortfolioItem[];
  } catch {
    return initialItems;
  }
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });
}
