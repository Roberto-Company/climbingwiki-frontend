"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { setLocaleAction } from "@/i18n/actions";
import type { Locale } from "@/i18n/config";

const NEXT_LOCALE: Record<Locale, Locale> = { es: "en", en: "es" };

/** Header button that toggles between Spanish and English, like a light/dark theme switch. */
export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("LocaleSwitcher");
  const [isPending, startTransition] = useTransition();
  const target = NEXT_LOCALE[locale];

  return (
    <button
      type="button"
      onClick={() => startTransition(() => setLocaleAction(target))}
      disabled={isPending}
      aria-label={t("switchTo", { language: t(`names.${target}`) })}
      title={t("switchTo", { language: t(`names.${target}`) })}
      className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-stone transition-colors hover:border-moss-600 hover:text-moss-600 disabled:opacity-60"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 0 18" />
        <path d="M12 3a14 14 0 0 0 0 18" />
      </svg>
      <span>{locale}</span>
    </button>
  );
}
