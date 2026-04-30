import { BriefcaseBusiness, UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { LinkButton } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { getAppSession } from "@/lib/app-session";

export default async function RegisterPage() {
  const session = await getAppSession();

  if (session?.user) {
    redirect(routes.postLogin);
  }

  return (
    <div className="min-h-screen bg-[#f4f7f9]">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f6b5f]">Cadastro</p>
          <h1 className="mt-2 text-4xl font-black text-[#1f2933]">Escolha seu tipo de conta</h1>
          <p className="mx-auto mt-3 max-w-2xl text-[#52616b]">Cada fluxo coleta dados diferentes para manter a experiência organizada para clientes e profissionais.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <AccountCard icon={<UserRound size={34} />} title="Cliente" text="Solicite orçamentos, favorite profissionais, acompanhe conversas e publique avaliações." href={routes.registerClient} />
          <AccountCard icon={<BriefcaseBusiness size={34} />} title="Trabalhador" text="Crie um perfil público, cadastre serviços, áreas atendidas, portfólio, documentos e WhatsApp." href={routes.registerWorker} />
        </div>
      </main>
    </div>
  );
}

function AccountCard({ icon, title, text, href }: { icon: React.ReactNode; title: string; text: string; href: string }) {
  return (
    <article className="rounded-[8px] border border-[#dbe5e1] bg-white p-6 shadow-sm">
      <div className="text-[#0f6b5f]">{icon}</div>
      <h2 className="mt-5 text-2xl font-black text-[#1f2933]">{title}</h2>
      <p className="mt-3 leading-7 text-[#52616b]">{text}</p>
      <LinkButton href={href} className="mt-6 w-full">Continuar</LinkButton>
    </article>
  );
}
