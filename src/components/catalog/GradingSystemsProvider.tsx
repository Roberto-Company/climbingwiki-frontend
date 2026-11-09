"use client";

import { createContext, useContext, useMemo } from "react";
import type { GradingSystemResponse } from "@/lib/types";

const GradingSystemsContext = createContext<ReadonlyMap<number, GradingSystemResponse>>(new Map());

/** Makes the grading systems (id → name, category) available to grade badges for conversion. */
export function GradingSystemsProvider({
  systems,
  children,
}: {
  systems: readonly GradingSystemResponse[];
  children: React.ReactNode;
}) {
  const byId = useMemo(() => new Map(systems.map((system) => [system.id, system])), [systems]);
  return <GradingSystemsContext.Provider value={byId}>{children}</GradingSystemsContext.Provider>;
}

export function useGradingSystem(id: number): GradingSystemResponse | undefined {
  return useContext(GradingSystemsContext).get(id);
}
