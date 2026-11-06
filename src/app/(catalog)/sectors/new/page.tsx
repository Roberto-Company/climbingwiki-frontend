import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getCrag } from "@/lib/api";
import { verifySession } from "@/lib/auth/dal";
import { idParam, loadOrNotFound, needsReview } from "@/lib/catalog/page-data";
import { EditPageShell } from "@/components/catalog/edit/EditPageShell";
import { SectorForm } from "@/components/catalog/edit/SectorForm";

type Props = {
  searchParams: Promise<{ cragId?: string }>;
};

export default async function NewSectorPage({ searchParams }: Props) {
  const session = await verifySession();
  const cragId = idParam((await searchParams).cragId);
  if (!cragId) {
    notFound();
  }
  const [crag, t] = await Promise.all([
    loadOrNotFound(() => getCrag(cragId)),
    getTranslations("Catalog.edit.titles"),
  ]);

  return (
    <EditPageShell title={t("newSector")} context={t("in", { name: crag.name })}>
      <SectorForm cragId={crag.id} cancelHref={`/crags/${crag.id}`} showReviewNote={needsReview(session)} />
    </EditPageShell>
  );
}
