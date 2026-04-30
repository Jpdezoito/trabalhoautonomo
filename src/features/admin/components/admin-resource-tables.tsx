"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/config/routes";
import { adminUsers, moderationCases, verificationQueue } from "@/features/admin/admin-data";
import { publicCategories, workers } from "@/lib/marketplace-data";

export function AdminUsersTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários da plataforma</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {adminUsers.map((user) => (
            <div key={user.id} className="grid gap-3 rounded-[8px] border border-border bg-surface p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-black text-foreground">{user.name}</p>
                <p className="mt-1 text-sm text-muted">{user.email} - {user.city}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={user.role === "Admin" ? "warning" : user.role === "Profissional" ? "info" : "primary"}>{user.role}</Badge>
                <Badge variant="success">{user.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminWorkersTable() {
  const [openWorkerSlug, setOpenWorkerSlug] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profissionais e verificação de identidade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {workers.map((worker) => {
            const isOpen = openWorkerSlug === worker.slug;
            const trustStatus = worker.trustVerification?.status ?? "em_analise";

            return (
              <div key={worker.slug} className="grid gap-4 rounded-[8px] border border-border bg-surface p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-black text-foreground">{worker.name}</p>
                    <p className="mt-1 text-sm text-muted">{worker.role} - {worker.neighborhood}, {worker.city}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={worker.available ? "success" : "warning"}>{worker.available ? "Disponível" : "Pausado"}</Badge>
                    <Badge variant={trustStatus === "verificado" ? "success" : trustStatus === "rejeitado" ? "danger" : "warning"}>
                      {trustStatus === "verificado" ? "Conta verificada" : trustStatus === "rejeitado" ? "Rejeitado" : "Em análise"}
                    </Badge>
                    <LinkButton href={`/admin/preview/profissional/${worker.slug}`} variant="outline" size="sm">
                      Preview
                    </LinkButton>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-expanded={isOpen}
                      onClick={() => setOpenWorkerSlug(isOpen ? null : worker.slug)}
                    >
                      {isOpen ? "Ocultar revisão" : "Revisar"}
                    </Button>
                  </div>
                </div>

                {isOpen ? (
                  <div className="grid gap-4 rounded-[8px] border border-border bg-surface-muted p-4 lg:grid-cols-[1fr_auto]">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <VerificationDetail label="Profissional" value={worker.name} />
                      <VerificationDetail label="Serviço" value={worker.role} />
                      <VerificationDetail label="Região" value={`${worker.neighborhood}, ${worker.city}`} />
                      <VerificationDetail label="Disponibilidade" value={worker.available ? "Disponível" : "Pausado"} />
                      <VerificationDetail label="Status da conta" value={trustStatus === "verificado" ? "Conta verificada" : trustStatus === "rejeitado" ? "Rejeitado" : "Em análise"} />
                      <VerificationDetail label="Origem" value="Perfil de teste do marketplace" />
                    </div>
                    <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                      <LinkButton href={routes.workerProfile(worker.slug)} variant="outline" size="sm">
                        Abrir perfil
                      </LinkButton>
                      <LinkButton href={routes.adminVerification} variant="outline" size="sm">
                        Ver verificacoes
                      </LinkButton>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminClientsTable() {
  const clients = adminUsers.filter((user) => user.role === "Cliente");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {clients.map((client) => (
            <div key={client.id} className="grid gap-3 rounded-[8px] border border-border bg-surface p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-black text-foreground">{client.name}</p>
                <p className="mt-1 text-sm text-muted">{client.email} - {client.city}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">{client.role}</Badge>
                <Badge variant="success">{client.status}</Badge>
                <LinkButton href={`/admin/preview/cliente/${client.id}`} variant="outline" size="sm">
                  Preview
                </LinkButton>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminCategoriesGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {publicCategories.map((category) => (
        <article key={category.slug} className="rounded-[8px] border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-normal text-primary">{category.group ?? "Marketplace"}</p>
              <h2 className="mt-1 text-xl font-black text-foreground">{category.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{category.description}</p>
            </div>
            <Badge variant="success">Ativa</Badge>
          </div>
          <p className="mt-4 text-sm font-semibold text-muted-strong">{category.professionals} profissionais vinculados</p>
        </article>
      ))}
    </div>
  );
}

export function AdminModerationTable() {
  const [openCaseId, setOpenCaseId] = useState<string | null>(null);
  const [caseStatuses, setCaseStatuses] = useState<Record<string, ModerationDecision>>({});

  function updateCaseStatus(id: string, decision: ModerationDecision) {
    setCaseStatuses((current) => ({
      ...current,
      [id]: decision,
    }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fila de moderação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {moderationCases.map((item) => {
            const isOpen = openCaseId === item.id;
            const decision = caseStatuses[item.id] ?? getInitialModerationDecision(item.status);

            return (
              <div id={item.id} key={item.id} className="scroll-mt-24 grid gap-4 rounded-[8px] border border-border bg-surface p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-black text-foreground">{item.target}</p>
                    <p className="mt-1 text-sm text-muted">{item.detail}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getModerationVariant(decision)}>{getModerationLabel(decision)}</Badge>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-expanded={isOpen}
                      onClick={() => setOpenCaseId(isOpen ? null : item.id)}
                    >
                      {isOpen ? "Ocultar análise" : "Analisar"}
                    </Button>
                  </div>
                </div>

                {isOpen ? (
                  <div className="grid gap-4 rounded-[8px] border border-border bg-surface-muted p-4 lg:grid-cols-[1fr_auto]">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <VerificationDetail label="Caso" value={item.id} />
                      <VerificationDetail label="Alvo" value={item.target} />
                      <VerificationDetail label="Fila" value={item.queue} />
                      <VerificationDetail label="Motivo" value={item.reason} />
                      <VerificationDetail label="Status" value={getModerationLabel(decision)} />
                      <VerificationDetail label="Origem" value="Dados de teste da moderação" />
                    </div>
                    <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                      <Button type="button" variant="outline" size="sm" onClick={() => updateCaseStatus(item.id, "approved")}>
                        Liberar
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => updateCaseStatus(item.id, "needs_changes")}>
                        Solicitar ajuste
                      </Button>
                      <Button type="button" variant="danger" size="sm" onClick={() => updateCaseStatus(item.id, "rejected")}>
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

type ModerationDecision = "open" | "in_review" | "needs_changes" | "approved" | "rejected";

function getInitialModerationDecision(status: string): ModerationDecision {
  if (status === "in_review") return "in_review";
  if (status === "action_required") return "needs_changes";

  return "open";
}

function getModerationLabel(decision: ModerationDecision) {
  if (decision === "approved") return "Liberado";
  if (decision === "rejected") return "Rejeitado";
  if (decision === "needs_changes") return "Ajuste solicitado";
  if (decision === "in_review") return "Em análise";

  return "Aberto";
}

function getModerationVariant(decision: ModerationDecision) {
  if (decision === "approved") return "success";
  if (decision === "rejected") return "danger";
  if (decision === "in_review") return "info";

  return "warning";
}

export function AdminVerificationTable() {
  const [openVerificationId, setOpenVerificationId] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificação de identidade dos perfis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {verificationQueue.map((item) => {
            const isOpen = openVerificationId === item.id;

            return (
              <div key={item.id} className="grid gap-4 rounded-[8px] border border-border bg-surface p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-black text-foreground">{item.workerName}</p>
                    <p className="mt-1 text-sm text-muted">{item.category} - {item.city}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-normal text-primary">Captura facial enviada em {item.submittedAt}</p>
                    <p className="mt-1 text-sm text-muted">
                      Origem: {item.captureSource === "webcam" ? "Verificação facial por webcam" : "Upload seguro"} | Tentativas: {item.retryCount}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={item.status === "approved" ? "success" : item.status === "pending" ? "warning" : "info"}>
                      {item.status === "approved" ? "Aprovado" : item.status === "pending" ? "Em análise" : "Rejeitado"}
                    </Badge>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-expanded={isOpen}
                      onClick={() => setOpenVerificationId(isOpen ? null : item.id)}
                    >
                      {isOpen ? "Ocultar verificação" : "Ver verificação"}
                    </Button>
                  </div>
                </div>

                {isOpen ? (
                  <div className="grid gap-4 rounded-[8px] border border-border bg-surface-muted p-4 lg:grid-cols-[1fr_auto]">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <VerificationDetail label="Protocolo" value={item.id} />
                      <VerificationDetail label="Profissional" value={item.workerName} />
                      <VerificationDetail label="Categoria" value={item.category} />
                      <VerificationDetail label="Cidade" value={item.city} />
                      <VerificationDetail label="Origem" value={item.captureSource === "webcam" ? "Webcam" : "Upload seguro"} />
                      <VerificationDetail label="Tentativas" value={String(item.retryCount)} />
                      <VerificationDetail label="Ambiente" value="Dados de teste" />
                      <VerificationDetail label="Captura facial" value="Registro simulado para validação do fluxo administrativo." />
                    </div>
                    <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                      <LinkButton href={routes.workerProfile(item.workerSlug)} variant="outline" size="sm">
                        Abrir perfil
                      </LinkButton>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function VerificationDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-normal text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
