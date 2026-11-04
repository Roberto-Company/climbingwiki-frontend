import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  title: string;
  subtitle?: string;
  description?: string | null;
  badges?: ReactNode;
};

export function CatalogCard({ href, title, subtitle, description, badges }: Props) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-border bg-surface px-5 py-4 transition-colors hover:border-moss-400 hover:bg-moss-50"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg font-medium text-foreground">{title}</h3>
        {subtitle && (
          <span className="shrink-0 font-sans text-xs font-semibold uppercase tracking-wide text-moss-600">
            {subtitle}
          </span>
        )}
        {badges && <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">{badges}</div>}
      </div>
      {description && <p className="mt-1 line-clamp-2 font-sans text-sm text-stone">{description}</p>}
    </Link>
  );
}
