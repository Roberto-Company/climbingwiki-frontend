import { useTranslations } from "next-intl";

/** Skeleton shared by every page while its data loads: a heading block and a few card placeholders. */
export default function Loading() {
  const t = useTranslations("Status");

  return (
    <div role="status" aria-live="polite" className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <span className="sr-only">{t("loading")}</span>
      <div aria-hidden="true" className="flex animate-pulse flex-col gap-3">
        <div className="h-3 w-24 rounded bg-surface-strong" />
        <div className="h-8 w-64 rounded bg-surface-strong" />
      </div>
      <div aria-hidden="true" className="flex animate-pulse flex-col gap-3">
        {[0, 1, 2].map((row) => (
          <div key={row} className="h-20 rounded-lg border border-border bg-surface" />
        ))}
      </div>
    </div>
  );
}
