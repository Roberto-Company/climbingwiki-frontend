import { getTranslations } from "next-intl/server";
import { getZone } from "@/lib/api";
import { verifySession } from "@/lib/auth/dal";
import { loadOrNotFound, needsReview, requireEditable } from "@/lib/catalog/page-data";
import { EditPageShell } from "@/components/catalog/edit/EditPageShell";
import { ZoneForm } from "@/components/catalog/edit/ZoneForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditZonePage({ params }: Props) {
  const { id } = await params;
  const session = await verifySession();
  const zone = await loadOrNotFound(() => getZone(Number(id)));
  requireEditable(session, zone, `/zones/${zone.id}`);
  const t = await getTranslations("Catalog.edit.titles");

  return (
    <EditPageShell title={t("editZone")} context={zone.name}>
      <ZoneForm
        zone={zone}
        parentZoneId={zone.parentZoneId}
        cancelHref={`/zones/${zone.id}`}
        showReviewNote={needsReview(session)}
      />
    </EditPageShell>
  );
}
