import type { PagedResponse } from "@/lib/types";

/** The API's largest page size. */
export const MAX_PAGE_SIZE = 100;

/**
 * Every item of a paged list: the first page tells how many pages there are, the rest are fetched
 * in parallel. For lists a page shows in full (a crag's sectors, a sector's routes for stats).
 */
export async function fetchAllPages<T>(
  fetchPage: (page: number, size: number) => Promise<PagedResponse<T>>,
): Promise<T[]> {
  const first = await fetchPage(0, MAX_PAGE_SIZE);
  const rest = await Promise.all(
    Array.from({ length: Math.max(first.totalPages - 1, 0) }, (_, i) => fetchPage(i + 1, MAX_PAGE_SIZE)),
  );
  return [first, ...rest].flatMap((page) => page.content);
}
