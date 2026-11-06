import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  basePath: string;
  page: number;
  totalPages: number;
};

export function Pagination({ basePath, page, totalPages }: Props) {
  const t = useTranslations("Catalog.pagination");

  if (totalPages <= 1) {
    return null;
  }

  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  return (
    <nav className="flex items-center justify-between font-sans text-sm">
      {hasPrev ? (
        <Link href={`${basePath}?page=${page - 1}`} className="font-semibold text-moss-600 hover:text-moss-800">
          {t("previous")}
        </Link>
      ) : (
        <span />
      )}
      <span className="text-stone">
        {t("pageOf", { page: page + 1, total: totalPages })}
      </span>
      {hasNext ? (
        <Link href={`${basePath}?page=${page + 1}`} className="font-semibold text-moss-600 hover:text-moss-800">
          {t("next")}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
