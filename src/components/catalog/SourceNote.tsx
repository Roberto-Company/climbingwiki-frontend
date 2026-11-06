import { useTranslations } from "next-intl";
import { uniqueSources } from "@/lib/catalog/attribution";

type Props = {
  /** Sources from the page's items; see `uniqueSources` for what is dropped. */
  sources: readonly (string | null)[];
};

/** Data attribution shown once per page instead of repeated in every description. */
export function SourceNote({ sources }: Props) {
  const t = useTranslations("Catalog");
  const unique = uniqueSources(sources);

  if (unique.length === 0) {
    return null;
  }

  return (
    <footer className="border-t border-border pt-3 font-sans text-xs text-stone">
      {unique.map((source) => (
        <p key={source}>{t("source", { source })}</p>
      ))}
    </footer>
  );
}
