import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { getDevAuthStatus, LoginForm } from "@/features/auth";
import { routes } from "@/config/routes";
import { getAppSession } from "@/lib/app-session";

export default async function LoginPage() {
  const session = await getAppSession();
  const devAuthStatus = await getDevAuthStatus();

  if (session?.user) {
    redirect(routes.postLogin);
  }

  return (
    <div className="min-h-screen bg-[#f4f7f9]">
      <SiteHeader />
      <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl place-items-center px-4 py-10">
        <section className="w-full max-w-md rounded-[8px] border border-[#dbe5e1] bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f6b5f]">Acesso</p>
          <h1 className="mt-2 text-3xl font-black text-[#1f2933]">Entrar na plataforma</h1>
          <p className="mt-2 text-sm leading-6 text-[#52616b]">Use seu e-mail para acessar orçamentos, favoritos, perfil profissional ou administração.</p>
          {process.env.NODE_ENV !== "production" ? (
            <div className="mt-4 grid gap-2 rounded-[8px] border border-[#dbe5e1] bg-[#f8fbfa] p-4 text-sm text-[#334e68]">
              <p className="font-bold text-[#0f6b5f]">Diagnóstico local</p>
              <p>No localhost, este projeto não exige captcha ou Cloudflare Turnstile no fluxo de login.</p>
              <p>
                Banco de dados:{" "}
                <span className={devAuthStatus?.databaseReachable ? "font-bold text-[#0f6b5f]" : "font-bold text-[#c2412d]"}>
                  {devAuthStatus?.databaseReachable ? "conectado" : "indisponivel"}
                </span>
              </p>
              <p>
                Admin seeded:{" "}
                <span className={devAuthStatus?.adminSeeded ? "font-bold text-[#0f6b5f]" : "font-bold text-[#c2412d]"}>
                  {devAuthStatus?.adminSeeded ? "sim" : "nao"}
                </span>
              </p>
              {!devAuthStatus?.databaseReachable ? <p>Inicie o PostgreSQL local antes de tentar entrar.</p> : null}
              {devAuthStatus?.databaseReachable && !devAuthStatus?.adminSeeded ? <p>Depois rode `npx prisma db push` e `npm run db:seed` para criar o admin local.</p> : null}
            </div>
          ) : null}
          <LoginForm />
        </section>
      </main>
    </div>
  );
}
