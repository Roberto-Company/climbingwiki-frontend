import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

/** Heading shared by the personal pages (favourites, logbook, lists, following). */
export function AccountHeader({ title, subtitle, children }: Props) {
  const t = useTranslations("Common");
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">{t("yourAccount")}</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 font-sans text-sm text-stone">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
