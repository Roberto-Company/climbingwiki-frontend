import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  title: string;
  subtitle?: string;
  description?: string | null;
  badges?: ReactNode;
  /** Extra content under the text, e.g. a sector's difficulty spread. */
  footer?: ReactNode;
};

export function CatalogCard({ href, title, subtitle, description, badges, footer }: Props) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-border bg-surface/70 px-5 py-4 shadow-[inset_3px_0_0_transparent] transition-[background-color,border-color,box-shadow] duration-200 hover:border-moss-400 hover:bg-surface hover:shadow-[inset_3px_0_0_var(--color-moss-600)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre-400"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg font-medium text-foreground">
          {title}
          <span
            aria-hidden="true"
            className="ml-1.5 inline-block text-moss-600 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
          >
            →
          </span>
        </h3>
        {subtitle && (
          <span className="shrink-0 font-sans text-xs font-semibold uppercase tracking-wide text-moss-600">{subtitle}</span>
        )}
        {badges && <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">{badges}</div>}
      </div>
      {description && <p className="mt-1 line-clamp-2 font-sans text-sm text-stone">{description}</p>}
      {footer && <div className="mt-3">{footer}</div>}
    </Link>
  );
}
