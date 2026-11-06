import { getTranslations } from "next-intl/server";
import { getCrag } from "@/lib/api";
import { verifySession } from "@/lib/auth/dal";
import { loadOrNotFound, needsReview, requireEditable } from "@/lib/catalog/page-data";
import { CragForm } from "@/components/catalog/edit/CragForm";
import { EditPageShell } from "@/components/catalog/edit/EditPageShell";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCragPage({ params }: Props) {
  const { id } = await params;
  const session = await verifySession();
  const crag = await loadOrNotFound(() => getCrag(Number(id)));
  requireEditable(session, crag, `/crags/${crag.id}`);
  const t = await getTranslations("Catalog.edit.titles");

  return (
    <EditPageShell title={t("editCrag")} context={crag.name}>
      <CragForm
        crag={crag}
        zoneId={crag.zoneId}
        cancelHref={`/crags/${crag.id}`}
        showReviewNote={needsReview(session)}
      />
    </EditPageShell>
  );
}
