import { prisma } from "@/lib/db";
import MapWithFilters from "@/components/map/MapWithFilters";
import type { Route as MapRoute } from "@/components/map/RoutesMap";

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
    orderBy: { startedAt: "desc" },
  });

  const routes: FilterableRoute[] = [];
  const memberMap = new Map<string, string>();

  for (const ride of rides) {
    if (!ride.polyline) continue;

    let positions: [number, number][] = [];
    try {
      const parsed = JSON.parse(ride.polyline) as [number, number][];
      if (Array.isArray(parsed)) {
        positions = parsed;
      }
    } catch {
      continue;
    }

    if (positions.length === 0) continue;

    if (ride.member) {
      memberMap.set(ride.member.id, ride.member.name);
    }

    const memberName = ride.member?.name ?? "Unknown rider";
    const startedAt = ride.startedAt.toISOString();

    const dateLabel = ride.startedAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    routes.push({
      id: ride.id,
      // These three are from MapRoute
      label: `${memberName} · ${dateLabel}`,
      positions,
      // Extra fields for filtering
      memberId: ride.memberId,
      memberName,
      startedAt,
      distanceKm: ride.distanceKm ?? null,
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