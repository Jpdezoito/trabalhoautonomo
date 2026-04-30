import { Bell, Eye, LockKeyhole, Phone, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, Input, Label, Select, Textarea } from "@/components/ui/form";
import { FacialEnrollmentCard } from "@/features/identity/components/facial-enrollment-card";
import { identityFeatureFlags } from "@/features/identity/constants";
import { TrustVerificationCard } from "@/features/trust";
import { cities, neighborhoods } from "@/lib/marketplace-data";

export function ClientSettingsPanel() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-6 xl:grid-cols-2">
        <AccountSettingsCard
          title="Conta"
          description="Dados basicos para acesso e identificacao da conta."
          fields={
            <>
              <Field>
                <Label>Nome completo</Label>
                <Input defaultValue="Mariana Almeida" />
              </Field>
              <Field>
                <Label>E-mail</Label>
                <Input type="email" defaultValue="mariana@email.com" />
              </Field>
            </>
          }
        />
        <PasswordSettingsCard />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ContactSettingsCard />
        <NotificationSettingsCard audience="client" />
      </section>

      <section>
        <FacialEnrollmentCard
          audience="cliente"
          enabled={identityFeatureFlags.clientEnrollmentEnabled}
          initialValue={{
            status: "pendente",
            retryCount: 0,
            recoveryEnabled: false,
          }}
        />
      </section>

      <section>
        <TrustVerificationCard audience="cliente" allowBackgroundCheck={false} />
      </section>

      <PrivacySettingsCard audience="client" />
    </div>
  );
}

export function WorkerSettingsPanel() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-6 xl:grid-cols-2">
        <AccountSettingsCard
          title="Conta profissional"
          description="Dados principais do acesso e identidade do perfil."
          fields={
            <>
              <Field>
                <Label>Nome público</Label>
                <Input defaultValue="Carlos Mendes" />
              </Field>
              <Field>
                <Label>E-mail de acesso</Label>
                <Input type="email" defaultValue="carlos@email.com" />
              </Field>
            </>
          }
        />
        <PasswordSettingsCard />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ContactSettingsCard />
        <NotificationSettingsCard audience="worker" />
      </section>

      <section id="plano" className="scroll-mt-20 grid gap-6 xl:grid-cols-2">
        <WorkerVisibilitySettingsCard />
        <PrivacySettingsCard audience="worker" />
      </section>

      <section>
        <FacialEnrollmentCard
          audience="profissional"
          initialValue={{
            status: "em_analise",
            retryCount: 1,
            submittedAt: "19/04/2026",
            recoveryEnabled: false,
          }}
        />
      </section>

      <section>
        <TrustVerificationCard audience="profissional" allowBackgroundCheck />
      </section>
    </div>
  );
}

export function AdminPlatformSettingsPanel() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <Field>
                <Label>Nome da plataforma</Label>
                <Input defaultValue="AutonomoPro" />
              </Field>
              <Field>
                <Label>E-mail de suporte</Label>
                <Input type="email" defaultValue="suporte@autonomopro.com.br" />
              </Field>
              <Field>
                <Label>Tempo máximo recomendado para resposta</Label>
                <Input defaultValue="24 horas" />
              </Field>
              <Field>
                <Label>Mensagem institucional curta</Label>
                <Textarea defaultValue="Marketplace premium para serviços autônomos locais, com verificação, orçamentos e moderação." />
              </Field>
              <Button type="button" className="w-fit">Salvar plataforma</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regras operacionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <ToggleRow title="Moderar novos perfis" description="Exigir revisão antes de publicar perfis profissionais." defaultChecked />
              <ToggleRow title="Exibir WhatsApp" description="Mostrar botao de contato direto em perfis aprovados." defaultChecked />
              <ToggleRow title="Publicar avaliações após revisão" description="Manter moderação antes de expor feedbacks ao público." defaultChecked />
              <ToggleRow title="Verificação facial para clientes" description="Permitir que clientes habilitem verificação facial como camada adicional de segurança." defaultChecked={identityFeatureFlags.clientEnrollmentEnabled} />
              <ToggleRow title="Confiança e protecao para clientes" description="Permitir verificação de identidade opcional para clientes com badge de confiança quando aprovado." defaultChecked />
              <ToggleRow title="Permitir favoritos" description="Ativar salvamento rápido de profissionais por clientes." defaultChecked />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <NotificationSettingsCard audience="admin" />
        <Card>
          <CardHeader>
            <CardTitle>Estado público</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <StatusLine icon={<ShieldCheck size={18} />} label="Moderação" value="Ativa" />
              <StatusLine icon={<Bell size={18} />} label="Alertas" value="Painel, e-mail e fila operacional" />
              <StatusLine icon={<Eye size={18} />} label="Marketplace" value="Publicado e indexavel" />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function AccountSettingsCard({
  title,
  description,
  fields,
}: {
  title: string;
  description: string;
  fields: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <FieldGroup>{fields}</FieldGroup>
          <Button type="button" className="w-fit">
            <UserRound className="mr-2" size={18} />
            Salvar conta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordSettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Senha</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <Field>
            <Label>Senha atual</Label>
            <Input type="password" defaultValue="12345678" />
          </Field>
          <FieldGroup>
            <Field>
              <Label>Nova senha</Label>
              <Input type="password" defaultValue="12345678" />
            </Field>
            <Field>
              <Label>Confirmar nova senha</Label>
              <Input type="password" defaultValue="12345678" />
            </Field>
          </FieldGroup>
          <Button type="button" variant="outline" className="w-fit">
            <LockKeyhole className="mr-2" size={18} />
            Atualizar senha
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ContactSettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contato</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <FieldGroup>
            <Field>
              <Label>WhatsApp</Label>
              <Input defaultValue="(11) 99999-2020" />
            </Field>
            <Field>
              <Label>Telefone alternativo</Label>
              <Input defaultValue="(11) 3333-2020" />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <Label>Cidade base</Label>
              <Select defaultValue="São Paulo">
                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>Bairro principal</Label>
              <Select defaultValue="Tatuapé">
                {neighborhoods.map((neighborhood) => (
                  <option key={neighborhood}>{neighborhood}</option>
                ))}
              </Select>
            </Field>
          </FieldGroup>
          <Field>
            <Label>Observações de contato</Label>
            <Textarea defaultValue="Prefiro retorno por WhatsApp e confirmação por e-mail quando houver orçamento detalhado." />
          </Field>
          <Button type="button" variant="outline" className="w-fit">
            <Phone className="mr-2" size={18} />
            Salvar contato
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function NotificationSettingsCard({ audience }: { audience: "client" | "worker" | "admin" }) {
  const audienceLabel = audience === "client" ? "cliente" : audience === "worker" ? "profissional" : "administrativo";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de notificacao</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <ToggleRow title="Alertas por e-mail" description={`Receber notificações ${audienceLabel} por e-mail.`} defaultChecked />
          <ToggleRow title="Alertas na plataforma" description="Exibir avisos no painel e no menu de perfil." defaultChecked />
          <ToggleRow title="Atualizações operacionais" description="Receber avisos sobre mudanças de status e retornos importantes." defaultChecked />
          <ToggleRow title="Resumo semanal" description="Consolidar atividade e novidades em um unico envio." />
        </div>
      </CardContent>
    </Card>
  );
}

function WorkerVisibilitySettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visibilidade do perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <ToggleRow title="Perfil público ativo" description="Permitir que o perfil apareca na busca pública." defaultChecked />
          <ToggleRow title="Exibir WhatsApp" description="Mostrar botao de contato direto para clientes." defaultChecked />
          <ToggleRow title="Receber novos orçamentos" description="Manter a agenda aberta para novos pedidos." defaultChecked />
          <ToggleRow title="Exibir preço inicial" description="Publicar referencia de valor no perfil." defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
}

function PrivacySettingsCard({ audience }: { audience: "client" | "worker" }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacidade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <ToggleRow title="Exibir cidade e bairro" description="Mostrar localização principal no perfil e em resultados." defaultChecked />
          <ToggleRow
            title={audience === "worker" ? "Exibir horario de resposta" : "Compartilhar local preferido no pedido"}
            description={audience === "worker" ? "Publicar previsao média de retorno para clientes." : "Preencher automaticamente cidade e bairro em novos pedidos."}
            defaultChecked
          />
          <ToggleRow title="Usar e-mail em contatos internos" description="Permitir comunicacoes operacionais importantes." defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
}

function ToggleRow({
  title,
  description,
  defaultChecked = false,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 rounded-[8px] border border-border bg-surface p-3">
      <input type="checkbox" defaultChecked={defaultChecked} className="mt-1" />
      <span>
        <span className="block font-black text-foreground">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-muted">{description}</span>
      </span>
    </label>
  );
}

function StatusLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[8px] bg-surface-muted p-3">
      <span className="text-primary">{icon}</span>
      <div>
        <p className="text-xs font-bold uppercase tracking-normal text-muted">{label}</p>
        <p className="mt-1 text-sm font-black text-foreground">{value}</p>
      </div>
    </div>
  );
}
