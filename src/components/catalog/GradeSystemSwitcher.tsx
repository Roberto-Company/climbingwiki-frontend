"use client";

import { useTranslations } from "next-intl";
import { systemsForCategory } from "@/lib/catalog/grade-conversion";
import { ORIGINAL, setGradeDisplayChoice, useGradeDisplayChoice } from "@/lib/catalog/grade-preference";
import type { GradingSystemCategory } from "@/lib/types";

type Props = {
  category: GradingSystemCategory;
};

/** Segmented control to show every grade of this category in one system; the choice is remembered. */
export function GradeSystemSwitcher({ category }: Props) {
  const t = useTranslations("Catalog.gradeSystems");
  const choice = useGradeDisplayChoice(category);
  const options = [
    { value: ORIGINAL, label: t("original") },
    ...systemsForCategory(category).map((system) => ({ value: system, label: t(`names.${system}`) })),
  ];

  return (
    <div role="radiogroup" aria-label={t("label")} className="flex flex-wrap items-center gap-1.5 font-sans text-xs">
      <span className="mr-1 font-semibold uppercase tracking-wide text-stone">{t("label")}</span>
      {options.map(({ value, label }) => {
        const isActive = value === choice;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setGradeDisplayChoice(category, value)}
            className={`rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre-400 ${
              isActive
                ? "border-moss-600 bg-moss-600 text-white"
                : "border-border text-stone hover:border-moss-600 hover:text-moss-700"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
