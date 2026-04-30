import Link from "next/link";
import { adminNavigation, clientNavigation, workerNavigation } from "@/config/navigation";
import { platformConfig } from "@/config/platform";
import { routes } from "@/config/routes";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#2f3832] bg-[linear-gradient(180deg,#202522_0%,#171b19_100%)] text-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <p className="text-xl font-black">{platformConfig.name}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#d8d0c2]">
            Profissionais locais com perfil completo, avaliação de clientes, portfólio, verificação e canais diretos de contato.
          </p>
        </div>
        <div>
          <p className="font-semibold">Marketplace</p>
          <div className="mt-3 grid gap-2 text-sm text-[#d8d0c2]">
            <Link href={routes.search}>Buscar serviços</Link>
            <Link href={routes.categories}>Explorar categorias</Link>
            <Link href={routes.howItWorks}>Como funciona</Link>
            <Link href={routes.registerWorker}>Cadastrar profissional</Link>
            <Link href={routes.registerClient}>Cadastrar cliente</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Gestao</p>
          <div className="mt-3 grid gap-2 text-sm text-[#d8d0c2]">
            <Link href={workerNavigation[0].href}>Painel profissional</Link>
            <Link href={clientNavigation[0].href}>Painel cliente</Link>
            <Link href={adminNavigation[0].href}>Administração</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Institucional</p>
          <div className="mt-3 grid gap-2 text-sm text-[#d8d0c2]">
            <Link href={routes.about}>Sobre</Link>
            <Link href={routes.contact}>Contato</Link>
            <Link href={routes.terms}>Termos de Uso</Link>
            <Link href={routes.privacy}>Politica de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
