import Link from "next/link";
import { useTranslations } from "next-intl";
import type { GradeLookup } from "@/lib/catalog/route-summary";
import type { RouteResponse } from "@/lib/types";
import { GradeBadge, RouteTypeBadge } from "./RouteBadges";
import { VerificationBadge } from "./VerificationBadge";

type Props = {
  routes: readonly RouteResponse[];
  lookup: GradeLookup;
  /** Number of the first row, so numbering continues across pages. */
  firstNumber?: number;
};

/** Numbered left to right like a topo, with the grade in the last column where the eye looks for it. */
export function RouteTable({ routes, lookup, firstNumber = 1 }: Props) {
  const t = useTranslations();
  const showType = new Set(routes.map((route) => route.routeType)).size > 1;

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse font-sans text-sm">
        <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wide text-stone">
          <tr>
            <th scope="col" className="w-12 px-4 py-2.5 text-right">
              {t("Catalog.routeTable.number")}
            </th>
            <th scope="col" className="px-3 py-2.5">
              {t("Catalog.routeTable.name")}
            </th>
            <th scope="col" className="px-3 py-2.5 text-right">
              {t("Catalog.routeTable.length")}
            </th>
            <th scope="col" className="w-20 px-4 py-2.5 text-right">
              {t("Catalog.routeTable.grade")}
            </th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route, index) => {
            const grade = route.hardestGradeId !== null ? (lookup.get(route.hardestGradeId) ?? null) : null;
            return (
              <tr key={route.id} className="group border-t border-border/70 transition-colors hover:bg-moss-50/60">
                <td className="px-4 py-2.5 text-right tabular-nums text-stone">{firstNumber + index}</td>
                <td className="px-3 py-2.5">
                  <Link
                    href={`/routes/${route.id}`}
                    className="font-medium text-foreground underline-offset-2 group-hover:text-moss-800 group-hover:underline"
                  >
                    {route.name}
                  </Link>
                  {(showType || !route.verified) && (
                    <span className="ml-2 inline-flex gap-1.5 align-middle">
                      {showType && <RouteTypeBadge routeType={route.routeType} />}
                      {!route.verified && <VerificationBadge verified={false} />}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums text-stone">
                  {route.totalLengthM !== null ? t("Common.meters", { value: route.totalLengthM }) : "–"}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <GradeBadge grade={grade} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
