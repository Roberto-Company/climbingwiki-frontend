import { useTranslations } from "next-intl";
import type { GradeResponse, RouteType } from "@/lib/types";

const BADGE_BASE = "inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold";

type GradeBand = "easy" | "medium" | "hard";

const GRADE_BAND_CLASSES: Record<GradeBand, string> = {
  easy: "bg-moss-200 text-moss-800",
  medium: "bg-ochre-200 text-foreground",
  hard: "bg-foreground text-background",
};

/** French-scale bands: up to 5c, 6a–6c+, 7a and harder. Other systems fall back to "medium". */
function gradeBand(label: string): GradeBand {
  const level = Number.parseInt(label, 10);
  if (Number.isNaN(level)) {
    return "medium";
  }
  if (level <= 5) {
    return "easy";
  }
  return level === 6 ? "medium" : "hard";
}

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
    <span className={`${BADGE_BASE} ${GRADE_BAND_CLASSES[gradeBand(grade.label)]}`} title={t("grade")}>
      {grade.label}
    </span>
  );
}
