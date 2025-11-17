"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline, Tooltip } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

export type Route = {
  id: string;
  label: string;
  positions: LatLngExpression[];
};

type RoutesMapProps = {
  routes: Route[];
};

export function RoutesMap({ routes }: RoutesMapProps) {
  // Center around Bloomington
  const center: LatLngExpression = [39.1679, -86.523];

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.positions}
            pathOptions={{ weight: 4 }}
          >
            <Tooltip sticky>{route.label}</Tooltip>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
}