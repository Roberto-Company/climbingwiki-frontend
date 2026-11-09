import Link from "next/link";
import type { ReactNode } from "react";
import type { RouteCard } from "@/lib/users/route-cards";
import { GradeBadge } from "@/components/catalog/RouteBadges";

type Props = {
  card: RouteCard;
  /** Shown before the route, e.g. the date of an ascent. */
  leading?: ReactNode;
  /** Shown before the grade, e.g. the ascent style. */
  meta?: ReactNode;
  /** Controls after the grade (remove, unfavourite…), outside the link. */
  actions?: ReactNode;
  children?: ReactNode;
};

/** One route in a personal list: name, where it is, and its grade where the eye expects it. */
export function RouteRow({ card, leading, meta, actions, children }: Props) {
  const { route, grade, sectorName, cragName } = card;
  const place = [cragName, sectorName].filter(Boolean).join(" · ");

  return (
    <li className="group flex items-start gap-4 rounded-lg border border-border bg-surface/60 px-4 py-3 transition-colors hover:border-moss-400 hover:bg-moss-50/60">
      {leading}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <Link
              href={`/routes/${route.id}`}
              className="font-display text-base font-medium text-foreground underline-offset-2 hover:text-moss-800 hover:underline"
            >
              {route.name}
            </Link>
            {place && <p className="mt-0.5 truncate font-sans text-xs text-stone">{place}</p>}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:pt-0.5">
            {meta}
            <GradeBadge grade={grade} />
            {actions}
          </div>
        </div>
        {children}
      </div>
    </li>
  );
}
