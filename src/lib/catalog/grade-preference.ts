import { useSyncExternalStore } from "react";
import type { GradingSystemCategory } from "@/lib/types";

/** "original" shows each grade in the system it was entered in; otherwise a system name. */
export type GradeDisplayChoice = "original" | string;

export const ORIGINAL: GradeDisplayChoice = "original";

const STORAGE_PREFIX = "climbingwiki.gradeSystem.";
const listeners = new Set<() => void>();

function storageKey(category: GradingSystemCategory): string {
  return STORAGE_PREFIX + category;
}

function readChoice(category: GradingSystemCategory): GradeDisplayChoice {
  try {
    return window.localStorage.getItem(storageKey(category)) ?? ORIGINAL;
  } catch {
    // Storage blocked (private mode, disabled cookies): fall back to the original grades.
    return ORIGINAL;
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key?.startsWith(STORAGE_PREFIX)) {
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Saves the choice for this category and updates every grade on the page at once. */
export function setGradeDisplayChoice(category: GradingSystemCategory, choice: GradeDisplayChoice): void {
  try {
    if (choice === ORIGINAL) {
      window.localStorage.removeItem(storageKey(category));
    } else {
      window.localStorage.setItem(storageKey(category), choice);
    }
  } catch {
    // Not persisted when storage is blocked; nothing else to do.
  }
  listeners.forEach((listener) => listener());
}

/** The visitor's choice for this category. Server renders and the first client render use the original. */
export function useGradeDisplayChoice(category: GradingSystemCategory): GradeDisplayChoice {
  return useSyncExternalStore(
    subscribe,
    () => readChoice(category),
    () => ORIGINAL,
  );
}
