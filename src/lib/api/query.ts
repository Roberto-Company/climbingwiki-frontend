export type QueryParams = Record<string, string | number | boolean | undefined>;

export function toQueryString(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params as QueryParams)) {
    if (value !== undefined) {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
}
