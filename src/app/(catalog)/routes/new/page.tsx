import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getSector } from "@/lib/api";
import { verifySession } from "@/lib/auth/dal";
import { idParam, loadGradeGroups, loadOrNotFound, needsReview } from "@/lib/catalog/page-data";
import { EditPageShell } from "@/components/catalog/edit/EditPageShell";
import { RouteForm } from "@/components/catalog/edit/RouteForm";

type Props = {
  searchParams: Promise<{ sectorId?: string }>;
};

export default async function NewRoutePage({ searchParams }: Props) {
  const session = await verifySession();
  const sectorId = idParam((await searchParams).sectorId);
  if (!sectorId) {
    notFound();
  }
  const [sector, gradeGroups, t] = await Promise.all([
    loadOrNotFound(() => getSector(sectorId)),
    loadGradeGroups(),
    getTranslations("Catalog.edit.titles"),
  ]);

  return (
    <EditPageShell title={t("newRoute")} context={t("in", { name: sector.name })}>
      <RouteForm
        sectorId={sector.id}
        tagIds={[]}
        gradeGroups={gradeGroups}
        cancelHref={`/sectors/${sector.id}`}
        showReviewNote={needsReview(session)}
      />
    </EditPageShell>
  );
}
