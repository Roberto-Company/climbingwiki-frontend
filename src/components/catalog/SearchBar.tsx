"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const t = useTranslations("Search");
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
    <form onSubmit={handleSubmit} role="search" className="flex w-full items-center gap-1 md:w-auto">
      <input
        ref={inputRef}
        type="search"
        name="q"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder={t("placeholder")}
        className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 font-sans text-base text-foreground placeholder:text-stone outline-none transition-all duration-200 focus:border-moss-600 md:w-44 md:flex-none md:py-1.5 md:text-sm md:focus:w-56"
      />
      <button
        type="submit"
        className="rounded-md px-3 py-2 font-sans text-sm font-medium text-stone hover:text-moss-600 md:px-2.5 md:py-1.5"
        aria-label={t("submit")}
      >
        ↵
      </button>
    </form>
  );
}
