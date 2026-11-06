"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { MapPoint } from "@/lib/map/points";

/** Topographic tiles: relief and paths matter more to climbers than street names. */
const TILE_URL = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)';
const MAX_ZOOM = 16;
const SINGLE_POINT_ZOOM = 14;
const FIT_PADDING: L.PointTuple = [36, 36];

const markerIcon = L.divIcon({
  className: "map-marker",
  html: '<span class="map-marker__dot"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -12],
});

type Props = {
  points: readonly MapPoint[];
  label: string;
};

export function PlacesMap({ points, label }: Props) {
  const bounds = L.latLngBounds(points.map((point) => point.position));
  const single = points.length === 1;

  return (
    <MapContainer
      {...(single ? { center: points[0].position, zoom: SINGLE_POINT_ZOOM } : { bounds, boundsOptions: { padding: FIT_PADDING } })}
      maxZoom={MAX_ZOOM}
      scrollWheelZoom={false}
      className="h-full w-full"
      aria-label={label}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={MAX_ZOOM} />
      {points.map((point) => (
        <Marker key={point.id} position={point.position} icon={markerIcon} title={point.name} alt={point.name}>
          <Popup>
            <Link href={point.href} className="font-display text-base font-medium text-foreground hover:text-moss-600">
              {point.name}
            </Link>
            {point.detail && <span className="mt-0.5 block font-sans text-xs text-stone">{point.detail}</span>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
