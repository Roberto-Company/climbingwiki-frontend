import { useTranslations } from "next-intl";
import { gradeBand, type GradeBand } from "@/lib/catalog/grade-bands";
import type { GradeResponse, RouteType } from "@/lib/types";

const BADGE_BASE = "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold tabular-nums";

const GRADE_BAND_CLASSES: Record<GradeBand, string> = {
  beginner: "bg-grade-beginner text-white",
  intermediate: "bg-grade-intermediate text-white",
  advanced: "bg-grade-advanced text-white",
  expert: "bg-grade-expert text-white",
};

export function RouteTypeBadge({ routeType }: { routeType: RouteType }) {
  const t = useTranslations("Catalog.routeTypes");
  return (
    <span className={`${BADGE_BASE} border border-moss-400 uppercase tracking-wide text-moss-800`}>
      {t(routeType)}
    </span>
  );
}

export function GradeBadge({ grade }: { grade: GradeResponse | null }) {
  const t = useTranslations("Catalog");
  if (grade === null) {
    return <span className={`${BADGE_BASE} border border-dashed border-border text-stone`}>{t("noGrade")}</span>;
  }
  return (
    <span className={`${BADGE_BASE} ${GRADE_BAND_CLASSES[gradeBand(grade)]}`} title={t("grade")}>
      {grade.label}
    </span>
  );
}
