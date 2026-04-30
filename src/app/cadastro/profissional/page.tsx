import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { routes } from "@/config/routes";
import { getAppSession } from "@/lib/app-session";
import { WorkerOnboardingFlow } from "@/features/workers/onboarding";

export default async function WorkerRegisterPage() {
  const session = await getAppSession();

  if (session?.user) {
    redirect(routes.postLogin);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-8 sm:py-10">
        <div className="mb-8 max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Cadastro profissional</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Monte um perfil completo para receber pedidos melhores.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
            Preencha as etapas com calma. Seu rascunho e salvo automaticamente neste navegador antes do envio para análise.
          </p>
        </div>
        <WorkerOnboardingFlow />
      </main>
    </div>
  );
}
