"use client";

import { useTranslations } from "next-intl";
import { gradeBand, type GradeBand } from "@/lib/catalog/grade-bands";
import type { GradeResponse, RouteType } from "@/lib/types";
import { useGradingSystem } from "./GradingSystemsProvider";
import { useDisplayGrade } from "./use-display-grade";

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
  return <KnownGradeBadge grade={grade} />;
}

/** Shows the grade in the visitor's chosen system, or as entered when there is no equivalent. */
function KnownGradeBadge({ grade }: { grade: GradeResponse }) {
  const t = useTranslations("Catalog");
  const { label, original } = useDisplayGrade(grade);
  const band = gradeBand(grade, useGradingSystem(grade.gradingSystemId)?.name);
  const title = original ? t("gradeSystems.convertedFrom", original) : t("grade");

  return (
    <span className={`${BADGE_BASE} ${GRADE_BAND_CLASSES[band]}`} title={title}>
      {original ? `≈ ${label}` : label}
    </span>
  );
}

/** "from – to" grade range in the visitor's chosen system, for page headers. */
export function GradeRange({ from, to }: { from: GradeResponse; to: GradeResponse }) {
  const t = useTranslations("Catalog.counts");
  const shownFrom = useDisplayGrade(from);
  const shownTo = useDisplayGrade(to);
  const approx = shownFrom.original || shownTo.original ? "≈ " : "";
  return <span>{approx + t("gradeRange", { from: shownFrom.label, to: shownTo.label })}</span>;
}
