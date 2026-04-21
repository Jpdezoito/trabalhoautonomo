import { SiteHeader } from "@/components/layout/site-header";
import { PasswordRecoveryFlow } from "@/features/recovery/components/password-recovery-flow";

export default function PasswordRecoveryPage() {
  return (
    <div className="min-h-screen bg-[#f4f7f9]">
      <SiteHeader />
      <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl place-items-center px-4 py-10">
        <section className="w-full max-w-2xl">
          <PasswordRecoveryFlow />
        </section>
      </main>
    </div>
  );
}
