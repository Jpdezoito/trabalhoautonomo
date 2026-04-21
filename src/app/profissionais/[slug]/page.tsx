import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WorkerProfile } from "@/components/marketplace/worker-profile";
import { getWorkerBySlug, workers } from "@/lib/marketplace-data";

type WorkerPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return workers.map((worker) => ({ slug: worker.slug }));
}

export default async function WorkerPage({ params }: WorkerPageProps) {
  const { slug } = await params;
  const worker = getWorkerBySlug(slug);

  if (!worker) {
    notFound();
  }

  return (
    <div>
      <SiteHeader />
      <WorkerProfile worker={worker} />
      <SiteFooter />
    </div>
  );
}
