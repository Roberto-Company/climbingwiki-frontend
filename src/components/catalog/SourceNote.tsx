import { useTranslations } from "next-intl";

type Props = {
  /** Sources from the page's items; nulls and duplicates are dropped. */
  sources: readonly (string | null)[];
};

/** Data attribution shown once per page instead of repeated in every description. */
export function SourceNote({ sources }: Props) {
  const t = useTranslations("Catalog");
  const unique = [...new Set(sources.filter((source): source is string => source !== null))];

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
