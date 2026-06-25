"use client";

import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1">
      <input
        ref={inputRef}
        type="search"
        name="q"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder="Search routes, crags…"
        className="w-44 rounded-md border border-border bg-background px-3 py-1.5 font-sans text-sm text-foreground placeholder:text-stone outline-none focus:border-moss-600 focus:w-56 transition-all duration-200"
      />
      <button
        type="submit"
        className="rounded-md px-2.5 py-1.5 font-sans text-sm font-medium text-stone hover:text-moss-600"
        aria-label="Search"
      >
        ↵
      </button>
    </form>
  );
}
