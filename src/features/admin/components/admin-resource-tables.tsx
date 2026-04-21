import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminUsers, moderationCases, verificationQueue } from "@/features/admin/admin-data";
import { publicCategories, workers } from "@/lib/marketplace-data";

export function AdminUsersTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios da plataforma</CardTitle>
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profissionais e verificacao de identidade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {workers.map((worker) => (
            <div key={worker.slug} className="grid gap-3 rounded-[8px] border border-border bg-surface p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-black text-foreground">{worker.name}</p>
                <p className="mt-1 text-sm text-muted">{worker.role} - {worker.neighborhood}, {worker.city}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={worker.available ? "success" : "warning"}>{worker.available ? "Disponivel" : "Pausado"}</Badge>
                <Badge variant={worker.trustVerification?.status === "verificado" ? "success" : worker.trustVerification?.status === "rejeitado" ? "danger" : "warning"}>
                  {worker.trustVerification?.status === "verificado" ? "Conta verificada" : worker.trustVerification?.status === "rejeitado" ? "Rejeitado" : "Em analise"}
                </Badge>
                <Button type="button" variant="outline" size="sm">Revisar</Button>
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fila de moderacao</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {moderationCases.map((item) => (
            <div key={item.id} className="grid gap-3 rounded-[8px] border border-border bg-surface p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-black text-foreground">{item.target}</p>
                <p className="mt-1 text-sm text-muted">{item.detail}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={item.status === "open" ? "warning" : item.status === "in_review" ? "info" : "danger"}>{item.reason}</Badge>
                <Button type="button" variant="outline" size="sm">Analisar</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminVerificationTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificacao de identidade dos perfis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {verificationQueue.map((item) => (
            <div key={item.id} className="grid gap-3 rounded-[8px] border border-border bg-surface p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-black text-foreground">{item.workerName}</p>
                <p className="mt-1 text-sm text-muted">{item.category} - {item.city}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-normal text-primary">Captura facial enviada em {item.submittedAt}</p>
                <p className="mt-1 text-sm text-muted">
                  Origem: {item.captureSource === "webcam" ? "Verificacao facial por webcam" : "Upload seguro"} | Tentativas: {item.retryCount}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={item.status === "approved" ? "success" : item.status === "pending" ? "warning" : "info"}>
                  {item.status === "approved" ? "Aprovado" : item.status === "pending" ? "Em analise" : "Rejeitado"}
                </Badge>
                <Button type="button" variant="outline" size="sm">
                  {item.status === "approved" ? "Ver verificacao" : "Enviar nova verificacao"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
