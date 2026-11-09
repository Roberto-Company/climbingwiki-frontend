import { describe, expect, it, vi } from "vitest";
import { fetchAllPages, MAX_PAGE_SIZE } from "./all-pages";
import type { PagedResponse } from "@/lib/types";

function pageOf(items: number[], page: number, size: number): PagedResponse<number> {
  const start = page * size;
  return {
    content: items.slice(start, start + size),
    page,
    size,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
  };
}

describe("fetchAllPages", () => {
  it("returns every item across pages, in order", async () => {
    const items = Array.from({ length: 250 }, (_, i) => i);
    const fetchPage = vi.fn((page: number, size: number) => Promise.resolve(pageOf(items, page, size)));

    const result = await fetchAllPages(fetchPage);

    expect(result).toEqual(items);
    expect(fetchPage).toHaveBeenCalledTimes(3);
    expect(fetchPage.mock.calls.map(([page, size]) => [page, size])).toEqual([
      [0, MAX_PAGE_SIZE],
      [1, MAX_PAGE_SIZE],
      [2, MAX_PAGE_SIZE],
    ]);
  });

  it("makes a single request when everything fits in one page", async () => {
    const fetchPage = vi.fn((page: number, size: number) => Promise.resolve(pageOf([1, 2, 3], page, size)));

    expect(await fetchAllPages(fetchPage)).toEqual([1, 2, 3]);
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it("returns an empty list when there are no items", async () => {
    const fetchPage = vi.fn((page: number, size: number) => Promise.resolve(pageOf([], page, size)));

    expect(await fetchAllPages(fetchPage)).toEqual([]);
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });
});
