"use client";

import dynamic from "next/dynamic";
import type { Route as MapRoute } from "@/components/map/RoutesMap";

// Dynamically import Leaflet map with SSR disabled
const RoutesMap = dynamic(() => import("@/components/map/RoutesMap"), {
  ssr: false,
});

export default function MemberRoutesMap({ routes }: { routes: MapRoute[] }) {
  return <RoutesMap routes={routes} />;
}