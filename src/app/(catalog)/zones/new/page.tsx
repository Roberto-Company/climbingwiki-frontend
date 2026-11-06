import { getTranslations } from "next-intl/server";
import { getZone } from "@/lib/api";
import { verifySession } from "@/lib/auth/dal";
import { idParam, loadOrNotFound, needsReview } from "@/lib/catalog/page-data";
import { EditPageShell } from "@/components/catalog/edit/EditPageShell";
import { ZoneForm } from "@/components/catalog/edit/ZoneForm";

type Props = {
  searchParams: Promise<{ parentZoneId?: string }>;
};

export default async function NewZonePage({ searchParams }: Props) {
  const session = await verifySession();
  const parentZoneId = idParam((await searchParams).parentZoneId);
  const [parent, t] = await Promise.all([
    parentZoneId ? loadOrNotFound(() => getZone(parentZoneId)) : Promise.resolve(null),
    getTranslations("Catalog.edit.titles"),
  ]);

  return (
    <EditPageShell title={t("newZone")} context={parent ? t("in", { name: parent.name }) : undefined}>
      <ZoneForm
        parentZoneId={parentZoneId}
        cancelHref={parent ? `/zones/${parent.id}` : "/zones"}
        showReviewNote={needsReview(session)}
      />
    </EditPageShell>
  );
}
