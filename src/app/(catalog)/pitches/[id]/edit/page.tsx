import { getTranslations } from "next-intl/server";
import { getPitch, getRoute } from "@/lib/api";
import { verifySession } from "@/lib/auth/dal";
import { loadGradeGroups, loadOrNotFound, needsReview, requireEditable } from "@/lib/catalog/page-data";
import { EditPageShell } from "@/components/catalog/edit/EditPageShell";
import { PitchForm } from "@/components/catalog/edit/PitchForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPitchPage({ params }: Props) {
  const { id } = await params;
  const session = await verifySession();
  const pitch = await loadOrNotFound(() => getPitch(Number(id)));
  requireEditable(session, pitch, `/routes/${pitch.routeId}`);
  const [route, gradeGroups, t] = await Promise.all([
    loadOrNotFound(() => getRoute(pitch.routeId)),
    loadGradeGroups(),
    getTranslations("Catalog.edit.titles"),
  ]);

  return (
    <EditPageShell title={t("editPitch")} context={route.name}>
      <PitchForm
        pitch={pitch}
        routeId={route.id}
        nextOrderIndex={pitch.orderIndex}
        gradeGroups={gradeGroups}
        cancelHref={`/routes/${route.id}`}
        showReviewNote={needsReview(session)}
      />
    </EditPageShell>
  );
}
