import { prisma } from "@/lib/db";
import MapWithFilters from "@/components/map/MapWithFilters";
import type { Route as MapRoute } from "@/components/map/RoutesMap";
import polyline from "@mapbox/polyline";

type FilterableRoute = MapRoute & {
  memberId: string;
  memberName: string;
  startedAt: string;
  distanceKm: number | null;
};

type MemberOption = {
  id: string;
  name: string;
};

export default async function MapPage() {
  // You can later restrict this if the dataset grows huge
  const rides = await prisma.ride.findMany({
    include: { member: true },
    orderBy: { startDate: "desc" },
  });

  const routes: FilterableRoute[] = [];
  const memberMap = new Map<string, string>();

  for (const ride of rides) {
    if (!ride.polyline) continue;

    let positions: [number, number][] = [];

    try {
      // 🔹 Decode Strava-encoded polyline -> [[lat, lng], ...]
      const decoded = polyline.decode(ride.polyline) as [number, number][];
      if (Array.isArray(decoded) && decoded.length > 0) {
        positions = decoded.map(
          ([lat, lng]) => [lat, lng] as [number, number]
        );
      }
    } catch (e) {
      console.error("Failed to decode polyline for ride", ride.id, e);
      continue;
    }

    if (positions.length === 0) continue;

    if (ride.member) {
      memberMap.set(ride.member.id, ride.member.name);
    }

    const memberName = ride.member?.name ?? "Unknown rider";
    const startedAt = ride.startDate.toISOString();

    const dateLabel = ride.startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    routes.push({
      id: ride.id,
      // MapRoute fields
      label: `${memberName} · ${dateLabel}`,
      positions,
      // Extra fields for filtering
      memberId: ride.memberId,
      memberName,
      startedAt,
      distanceKm:
        typeof ride.distanceMeters === "number"
          ? ride.distanceMeters / 1000 // 🔹 meters -> km
          : null,
    });
  }

  const members: MemberOption[] = Array.from(memberMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-4">
      <MapWithFilters routes={routes} members={members} />
    </div>
  );
}