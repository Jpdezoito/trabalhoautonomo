"use client";

import { useState } from "react";
import { Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldHint, Input, Label, Textarea } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { Worker } from "@/types/marketplace";

type SubmitState =
  | { status: "idle"; message: string }
  | { status: "submitting"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string; errors?: Record<string, string[]> };

export function ReviewForm({ worker }: { worker: Worker }) {
  const [rating, setRating] = useState(5);
  const [state, setState] = useState<SubmitState>({ status: "idle", message: "" });
  const fieldErrors = state.status === "error" ? state.errors : undefined;

  async function submitReview(formData: FormData) {
    setState({ status: "submitting", message: "Enviando avaliação..." });

    const payload = {
      workerSlug: worker.slug,
      author: formData.get("author"),
      email: formData.get("email"),
      showName: formData.get("showName") === "on",
      serviceReference: formData.get("serviceReference"),
      rating,
      title: formData.get("title"),
      comment: formData.get("comment"),
    };

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setState({
        status: "error",
        message: result?.message ?? "Não foi possível enviar sua avaliação.",
        errors: result?.errors,
      });
      return;
    }

    setState({
      status: "success",
      message: result?.message ?? "Avaliação enviada para moderação.",
    });
  }

  return (
    <Card id="avaliar">
      <CardHeader>
        <CardTitle>Publicar avaliação</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={submitReview} className="grid gap-4">
          <FieldGroup>
            <Field>
              <Label htmlFor="review-author">Seu nome</Label>
              <Input id="review-author" name="author" placeholder="Ex.: Mariana Almeida" />
              <FieldHint className="min-h-10">Opcional. Se preencher, mostraremos apenas o primeiro nome.</FieldHint>
              <FieldMessage errors={fieldErrors?.author} />
            </Field>
            <Field>
              <Label htmlFor="review-email">E-mail</Label>
              <Input id="review-email" name="email" type="email" placeholder="voce@email.com" />
              <FieldHint className="min-h-10">Opcional. Usado apenas para verificação interna, nunca será exibido.</FieldHint>
              <FieldMessage errors={fieldErrors?.email} />
            </Field>
          </FieldGroup>

          <label className="flex items-start gap-3 rounded-[8px] border border-border bg-surface-muted p-3 text-sm font-semibold text-muted-strong">
            <input name="showName" type="checkbox" className="mt-1 size-4 rounded border-border accent-primary" />
            Quero exibir meu nome na avaliação
          </label>

          <Field>
            <Label>Nota do atendimento</Label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={cn(
                    "inline-flex h-11 min-w-11 items-center justify-center rounded-[8px] border px-3 font-black transition",
                    value <= rating ? "border-accent bg-warning-soft text-warning" : "border-border bg-surface text-muted hover:bg-surface-muted",
                  )}
                  aria-label={`${value} estrela${value > 1 ? "s" : ""}`}
                >
                  <Star className={cn("mr-1", value <= rating && "fill-current")} size={17} />
                  {value}
                </button>
              ))}
            </div>
          </Field>

          <Field>
            <Label htmlFor="review-service">Serviço realizado ou contato</Label>
            <Input id="review-service" name="serviceReference" placeholder="Ex.: troca de tomada, frete, reparo hidraulico" />
            <FieldMessage errors={fieldErrors?.serviceReference} />
          </Field>

          <Field>
            <Label htmlFor="review-title">Titulo</Label>
            <Input id="review-title" name="title" placeholder="Ex.: Atendimento pontual e bem explicado" />
            <FieldMessage errors={fieldErrors?.title} />
          </Field>

          <Field>
            <Label htmlFor="review-comment">Comentario</Label>
            <Textarea id="review-comment" name="comment" placeholder="Conte como foi o atendimento, prazo, comunicacao e qualidade do serviço." />
            <FieldMessage errors={fieldErrors?.comment} />
          </Field>

          {state.message ? (
            <div
              className={cn(
                "rounded-[8px] border p-4 text-sm font-semibold",
                state.status === "success" && "border-success/30 bg-success-soft text-success",
                state.status === "error" && "border-danger/30 bg-danger-soft text-danger",
                state.status === "submitting" && "border-border bg-surface-muted text-muted-strong",
              )}
            >
              {state.message}
            </div>
          ) : null}

          <Button type="submit" disabled={state.status === "submitting"}>
            <Send className="mr-2" size={18} />
            Enviar para moderação
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function FieldMessage({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <FieldError>{errors[0]}</FieldError>;
}
