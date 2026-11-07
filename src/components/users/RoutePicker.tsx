"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { searchRoutesAction, type RouteOption } from "@/lib/users/route-search";
import { GradeBadge } from "@/components/catalog/RouteBadges";

type Props = {
  /** Name of the hidden input that carries the chosen route id. */
  name?: string;
  label: string;
  error?: string;
  /** Change this (e.g. after a successful submit) to clear the choice. */
  resetKey?: unknown;
};

const DEBOUNCE_MS = 250;

/** Search a route by name instead of typing its id. Keyboard: arrows to move, Enter to choose, Escape to close. */
export function RoutePicker({ name = "routeId", label, error, resetKey }: Props) {
  const t = useTranslations("Personal.routePicker");
  const inputId = useId();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<RouteOption[]>([]);
  const [active, setActive] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selected, setSelected] = useState<RouteOption | null>(null);
  const [lastReset, setLastReset] = useState(resetKey);
  const inputRef = useRef<HTMLInputElement>(null);

  if (resetKey !== lastReset) {
    setLastReset(resetKey);
    setSelected(null);
    setQuery("");
    setOptions([]);
  }

  useEffect(() => {
    if (selected || query.trim().length < 2) {
      return;
    }
    let isCurrent = true;
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchRoutesAction(query);
        if (isCurrent) {
          setOptions(results);
          setActive(0);
          setIsOpen(true);
        }
      } finally {
        if (isCurrent) {
          setIsSearching(false);
        }
      }
    }, DEBOUNCE_MS);
    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [query, selected]);

  function choose(option: RouteOption) {
    setSelected(option);
    setIsOpen(false);
  }

  function clear() {
    setSelected(null);
    setQuery("");
    setOptions([]);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && options.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActive((index) => (index + 1) % options.length);
    } else if (event.key === "ArrowUp" && options.length > 0) {
      event.preventDefault();
      setActive((index) => (index - 1 + options.length) % options.length);
    } else if (event.key === "Enter" && isOpen && options[active]) {
      event.preventDefault();
      choose(options[active]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  const hasQuery = query.trim().length >= 2;
  const showEmpty = isOpen && hasQuery && !isSearching && options.length === 0;
  const showOptions = isOpen && hasQuery && options.length > 0;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="font-sans text-sm font-medium text-foreground">
        {label}
      </label>
      <input type="hidden" name={name} value={selected?.id ?? ""} />

      {selected ? (
        <div className="flex items-center justify-between gap-3 rounded-md border border-moss-400 bg-moss-50 px-3.5 py-2">
          <div className="min-w-0">
            <p className="break-words font-display text-base font-medium text-foreground">{selected.name}</p>
            {selected.place && <p className="truncate font-sans text-xs text-stone">{selected.place}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <GradeBadge grade={selected.grade} />
            <button type="button" onClick={clear} className="font-sans text-sm font-semibold text-moss-600 hover:text-moss-800">
              {t("change")}
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={isOpen && options[active] ? `${listId}-${options[active].id}` : undefined}
            aria-invalid={error ? true : undefined}
            autoComplete="off"
            value={query}
            placeholder={t("placeholder")}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => options.length > 0 && setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 120)}
            className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 font-sans text-base text-foreground outline-none transition-colors focus:border-moss-600"
          />
          {isSearching && (
            <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-border border-t-moss-600" />
          )}
          {showOptions || showEmpty ? (
            <ul
              id={listId}
              role="listbox"
              className="menu-in absolute left-0 right-0 top-full z-40 mt-1 max-h-80 overflow-auto rounded-lg border border-border bg-background p-1 shadow-[0_18px_40px_-12px_rgba(31,42,29,0.35)]"
            >
              {showEmpty && <li className="px-3 py-2.5 font-sans text-sm text-stone">{t("noResults")}</li>}
              {options.map((option, index) => (
                <li
                  key={option.id}
                  id={`${listId}-${option.id}`}
                  role="option"
                  aria-selected={index === active}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(option)}
                  onMouseEnter={() => setActive(index)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 ${index === active ? "bg-moss-50" : ""}`}
                >
                  <span className="min-w-0">
                    <span className="block break-words font-sans text-sm font-medium text-foreground">{option.name}</span>
                    {option.place && <span className="block truncate font-sans text-xs text-stone">{option.place}</span>}
                  </span>
                  <GradeBadge grade={option.grade} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
      {error && <p className="font-sans text-sm text-red-700">{error}</p>}
    </div>
  );
}
