import { useTranslations } from "next-intl";
import type { LogbookEntryResult } from "@/lib/types";

/** Clean ascents stand out; tries and top-ropes stay quiet. */
const STYLES: Record<LogbookEntryResult, string> = {
  ONSIGHT: "bg-ochre-400 text-night",
  FLASH: "bg-ochre-200 text-night",
  REDPOINT: "bg-moss-600 text-white",
  TOP_ROPE: "border border-moss-400 text-moss-800",
  ATTEMPT: "border border-dashed border-border text-stone",
};

export function LogbookResultBadge({ result }: { result: LogbookEntryResult }) {
  const t = useTranslations("LogbookResults");
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wide ${STYLES[result]}`}
    >
      {t(result)}
    </span>
  );
}
