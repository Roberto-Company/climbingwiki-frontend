"use client";

import dynamic from "next/dynamic";
import type { MapPoint } from "@/lib/map/points";

/** Leaflet touches `window` on import, so the map only loads in the browser. */
const PlacesMap = dynamic(() => import("./PlacesMap").then((module) => module.PlacesMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-surface-strong/50" />,
});

type Props = {
  points: readonly MapPoint[];
  label: string;
  className?: string;
};

export function PlacesMapLazy({ points, label, className = "h-80" }: Props) {
  if (points.length === 0) {
    return null;
  }
  return (
    <div className={`relative z-0 overflow-hidden rounded-lg border border-border ${className}`}>
      <PlacesMap points={points} label={label} />
    </div>
  );
}
