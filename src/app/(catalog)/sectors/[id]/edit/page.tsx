import { getTranslations } from "next-intl/server";
import { getSector } from "@/lib/api";
import { verifySession } from "@/lib/auth/dal";
import { loadOrNotFound, needsReview, requireEditable } from "@/lib/catalog/page-data";
import { EditPageShell } from "@/components/catalog/edit/EditPageShell";
import { SectorForm } from "@/components/catalog/edit/SectorForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditSectorPage({ params }: Props) {
  const { id } = await params;
  const session = await verifySession();
  const sector = await loadOrNotFound(() => getSector(Number(id)));
  requireEditable(session, sector, `/sectors/${sector.id}`);
  const t = await getTranslations("Catalog.edit.titles");

  return (
    <EditPageShell title={t("editSector")} context={sector.name}>
      <SectorForm
        sector={sector}
        cragId={sector.cragId}
        cancelHref={`/sectors/${sector.id}`}
        showReviewNote={needsReview(session)}
      />
    </EditPageShell>
  );
}
