import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type InstitutionalSection = {
  title: string;
  body: string[];
};

type InstitutionalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: InstitutionalSection[];
};

export function InstitutionalPage({ eyebrow, title, description, sections }: InstitutionalPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="container-page py-12 sm:py-16">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-foreground sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted">{description}</p>
          </div>
        </section>

        <section className="container-page py-10 sm:py-14">
          <div className="grid gap-6">
            {sections.map((section) => (
              <article key={section.title} className="rounded-[8px] border border-border bg-surface p-6 shadow-[var(--shadow-sm)]">
                <h2 className="text-2xl font-black tracking-tight text-foreground">{section.title}</h2>
                <div className="mt-4 grid gap-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-8 text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
