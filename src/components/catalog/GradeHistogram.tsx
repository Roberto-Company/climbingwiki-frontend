import { useTranslations } from "next-intl";
import type { GradeBand, HistogramBin } from "@/lib/catalog/grade-bands";

export const GRADE_BAND_FILL: Record<GradeBand, string> = {
  beginner: "bg-grade-beginner",
  intermediate: "bg-grade-intermediate",
  advanced: "bg-grade-advanced",
  expert: "bg-grade-expert",
};

const BAR_AREA_PX = 112;
const CROWDED_BINS = 10;

type Props = {
  bins: readonly HistogramBin[];
};

/** Routes per grade, the way guidebooks summarise a crag. Bars grow in as the chart scrolls into view. */
export function GradeHistogram({ bins }: Props) {
  const t = useTranslations("Catalog.histogram");
  if (bins.length === 0) {
    return null;
  }
  const max = Math.max(...bins.map((bin) => bin.count));
  const total = bins.reduce((sum, bin) => sum + bin.count, 0);
  // On phones a long scale has no room for every label; the "+" grades keep their bars but not their tick.
  const crowded = bins.length > CROWDED_BINS;

  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="font-display text-lg font-medium text-foreground">{t("title")}</span>
        <span className="font-sans text-xs text-stone">{t("total", { count: total })}</span>
      </figcaption>
      <ol className="flex items-end gap-1" style={{ height: BAR_AREA_PX + 40 }} aria-label={t("title")}>
        {bins.map((bin) => (
          <li key={bin.grade.id} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
            <span className="font-sans text-[11px] tabular-nums text-stone">{bin.count > 0 ? bin.count : ""}</span>
            <span
              className={`grow-on-view block w-full max-w-10 rounded-t-sm ${bin.count > 0 ? GRADE_BAND_FILL[bin.band] : "bg-border/50"}`}
              style={{ height: bin.count > 0 ? Math.max(4, (bin.count / max) * BAR_AREA_PX) : 2 }}
              aria-hidden="true"
            />
            <span className={`font-sans text-xs font-semibold text-foreground ${crowded && bin.grade.label.endsWith("+") ? "max-sm:invisible" : ""}`}>
              {bin.grade.label}
            </span>
            <span className="sr-only">{t("bar", { count: bin.count, grade: bin.grade.label })}</span>
          </li>
        ))}
      </ol>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-stone">
        {(Object.keys(GRADE_BAND_FILL) as GradeBand[])
          .filter((band) => bins.some((bin) => bin.band === band && bin.count > 0))
          .map((band) => (
            <li key={band} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-sm ${GRADE_BAND_FILL[band]}`} aria-hidden="true" />
              {t(`bands.${band}`)}
            </li>
          ))}
      </ul>
    </figure>
  );
}
