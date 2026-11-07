"use client";

import { useEffect, useState } from "react";
import { phaseAfterCheck, WAKE_POLL_MS, type WakePhase } from "./backend-wake";

async function isBackendUp(): Promise<boolean> {
  try {
    const response = await fetch("/backend-status", { cache: "no-store" });
    const data: unknown = await response.json();
    return typeof data === "object" && data !== null && (data as { up?: unknown }).up === true;
  } catch {
    return false;
  }
}

/**
 * Checks whether the API is asleep and, if so, polls until it answers, then calls onReady.
 * A new `error` (the page failed again after a retry) starts a fresh check.
 */
export function useBackendWake(onReady: () => void, error: unknown): WakePhase {
  const [tracked, setTracked] = useState<{ error: unknown; phase: WakePhase }>({ error, phase: "checking" });
  // A new error starts over (React's "adjust state when a prop changes" pattern, during render).
  if (tracked.error !== error) {
    setTracked({ error, phase: "checking" });
  }

  useEffect(() => {
    const startedAt = Date.now();
    let wasWaking = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    async function check() {
      const isUp = await isBackendUp();
      if (cancelled) {
        return;
      }
      const next = phaseAfterCheck({ isUp, wasWaking, startedAt, now: Date.now() });
      if (next === "ready") {
        onReady();
        return;
      }
      setTracked({ error, phase: next });
      if (next === "waking") {
        wasWaking = true;
        timer = setTimeout(check, WAKE_POLL_MS);
      }
    }

    void check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // onReady is the error boundary's retry; restarting on every render would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return tracked.error === error ? tracked.phase : "checking";
}
