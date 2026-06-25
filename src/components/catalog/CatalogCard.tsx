import Link from "next/link";

type Props = {
  href: string;
  title: string;
  subtitle?: string;
  description?: string | null;
};

export function CatalogCard({ href, title, subtitle, description }: Props) {
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
      </div>
      {description && <p className="mt-1 line-clamp-2 font-sans text-sm text-stone">{description}</p>}
    </Link>
  );
}
