import { getTranslations } from "next-intl/server";
import { getZone } from "@/lib/api";
import { verifySession } from "@/lib/auth/dal";
import { idParam, loadOrNotFound, needsReview } from "@/lib/catalog/page-data";
import { CragForm } from "@/components/catalog/edit/CragForm";
import { EditPageShell } from "@/components/catalog/edit/EditPageShell";

type Props = {
  searchParams: Promise<{ zoneId?: string }>;
};

export default async function NewCragPage({ searchParams }: Props) {
  const session = await verifySession();
  const zoneId = idParam((await searchParams).zoneId);
  const [zone, t] = await Promise.all([
    zoneId ? loadOrNotFound(() => getZone(zoneId)) : Promise.resolve(null),
    getTranslations("Catalog.edit.titles"),
  ]);

  return (
    <EditPageShell title={t("newCrag")} context={zone ? t("in", { name: zone.name }) : undefined}>
      <CragForm
        zoneId={zoneId}
        cancelHref={zone ? `/zones/${zone.id}` : "/zones"}
        showReviewNote={needsReview(session)}
      />
    </EditPageShell>
  );
}
