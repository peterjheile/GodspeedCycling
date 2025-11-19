"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline, Tooltip } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

export type Route = {
  id: string;
  label?: string;                   // ← make optional
  positions: LatLngExpression[];    // decoded [lat, lng] pairs
};

type RoutesMapProps = {
  routes: Route[];
};

export default function RoutesMap({ routes }: RoutesMapProps) {
  // Fallback center if there are no routes
  const defaultCenter: LatLngExpression = [39.1679, -86.523];

  const firstPoint =
    routes[0]?.positions?.[0] ?? defaultCenter;

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border">
      <MapContainer
        center={firstPoint}
        zoom={13}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routes.map((route) =>
          route.positions && route.positions.length ? (
            <Polyline
              key={route.id}
              positions={route.positions}
              pathOptions={{ weight: 4 }}
            >
              {route.label && <Tooltip sticky>{route.label}</Tooltip>}
            </Polyline>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}