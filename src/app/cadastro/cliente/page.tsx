import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { routes } from "@/config/routes";
import { getAppSession } from "@/lib/app-session";
import { ClientOnboardingFlow } from "@/features/clients/onboarding";

export default async function ClientRegisterPage() {
  const session = await getAppSession();

  if (session?.user) {
    redirect(routes.postLogin);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-8 sm:py-10">
        <div className="mb-8 max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Cadastro de cliente</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Configure seu perfil para encontrar profissionais mais rapido.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
            Informe sua localizacao, interesses e contatos. O fluxo e simples, e seu rascunho fica salvo neste navegador.
          </p>
        </div>
        <ClientOnboardingFlow />
      </main>
    </div>
  );
}
