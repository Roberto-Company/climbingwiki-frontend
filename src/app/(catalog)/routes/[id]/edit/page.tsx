import { getTranslations } from "next-intl/server";
import { getRoute } from "@/lib/api";
import { verifySession } from "@/lib/auth/dal";
import { loadOrNotFound, needsReview, requireEditable, tagIdsFor } from "@/lib/catalog/page-data";
import { EditPageShell } from "@/components/catalog/edit/EditPageShell";
import { RouteForm } from "@/components/catalog/edit/RouteForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditRoutePage({ params }: Props) {
  const { id } = await params;
  const session = await verifySession();
  const route = await loadOrNotFound(() => getRoute(Number(id)));
  requireEditable(session, route, `/routes/${route.id}`);
  const [tagIds, t] = await Promise.all([tagIdsFor(route.tags), getTranslations("Catalog.edit.titles")]);

  return (
    <EditPageShell title={t("editRoute")} context={route.name}>
      <RouteForm
        route={route}
        sectorId={route.sectorId}
        tagIds={tagIds}
        gradeGroups={[]}
        cancelHref={`/routes/${route.id}`}
        showReviewNote={needsReview(session)}
      />
    </EditPageShell>
  );
}
