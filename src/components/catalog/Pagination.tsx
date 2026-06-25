import Link from "next/link";

type Props = {
  basePath: string;
  page: number;
  totalPages: number;
};

export function Pagination({ basePath, page, totalPages }: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  return (
    <nav className="flex items-center justify-between font-sans text-sm">
      {hasPrev ? (
        <Link href={`${basePath}?page=${page - 1}`} className="font-semibold text-moss-600 hover:text-moss-800">
          ← Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-stone">
        Page {page + 1} of {totalPages}
      </span>
      {hasNext ? (
        <Link href={`${basePath}?page=${page + 1}`} className="font-semibold text-moss-600 hover:text-moss-800">
          Next →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
