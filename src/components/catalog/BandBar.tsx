import { useTranslations } from "next-intl";
import type { GradeBand } from "@/lib/catalog/grade-bands";
import { GRADE_BAND_FILL } from "./GradeHistogram";

type Props = {
  counts: readonly { band: GradeBand; count: number }[];
};

/** One thin bar split by difficulty band, so sectors can be compared at a glance. */
export function BandBar({ counts }: Props) {
  const t = useTranslations("Catalog.histogram.bands");
  const total = counts.reduce((sum, entry) => sum + entry.count, 0);
  if (total === 0) {
    return null;
  }
  const summary = counts.map((entry) => `${t(entry.band)}: ${entry.count}`).join(", ");

  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-border/40" role="img" aria-label={summary} title={summary}>
      {counts.map((entry) => (
        <span key={entry.band} className={GRADE_BAND_FILL[entry.band]} style={{ width: `${(entry.count / total) * 100}%` }} />
      ))}
    </div>
  );
}
