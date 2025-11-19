import { prisma } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import polyline from "@mapbox/polyline";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Route as MapRoute } from "@/components/map/RoutesMap";
import MemberRoutesMap from "@/components/map/MemberRoutesMap";

type PageProps = {
  // in your setup, params is treated as a Promise
  params: Promise<{
    id: string;
  }>;
};

function roleToLabel(role: MemberRole) {
  switch (role) {
    case "COACH":
      return "Coach";
    case "MECHANIC":
      return "Mechanic";
    case "MANAGER":
      return "Manager";
    case "ALUMNI":
      return "Alumni";
    case "OTHER":
      return "Staff";
    case "RIDER":
    default:
      return "Rider";
  }
}

function formatJoined(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRideDate(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDurationFromSeconds(seconds: number | null | undefined) {
  if (!seconds || seconds <= 0) return "Unknown";

  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;

  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins === 0 ? `${hours} h` : `${hours} h ${remMins} min`;
}

export default async function MemberProfilePage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      rides: {
        orderBy: { startDate: "desc" },
      },
    },
  });

  if (!member) {
    notFound();
  }

  // Build routes for this member's rides
  const routes: MapRoute[] = [];
  let totalDistanceKm = 0;
  const now = new Date();

  for (const ride of member.rides) {
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

    const dateLabel = ride.startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const distanceKm =
      typeof ride.distanceMeters === "number"
        ? ride.distanceMeters / 1000 // meters -> km
        : 0;

    totalDistanceKm += distanceKm;

    routes.push({
      id: ride.id,
      label:
        distanceKm > 0
          ? `${dateLabel} · ${distanceKm.toFixed(1)} km`
          : dateLabel,
      positions,
    });
  }

  const totalRides = member.rides.length;
  const lastRide = member.rides[0] ?? null;

  // optional: last 30 days stats (by ride count)
  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const ridesLastMonth = member.rides.filter(
    (r) => r.startDate >= monthAgo
  ).length;

  const totalDistanceRounded =
    totalDistanceKm > 0 ? totalDistanceKm.toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Simple avatar placeholder */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-semibold">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {member.name}
              </h1>
              <Badge variant="outline">{roleToLabel(member.role)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Joined {formatJoined(member.joinedAt)}
            </p>
            {member.bio && (
              <p className="max-w-xl text-sm text-muted-foreground">
                {member.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/members">Back to team</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/map">View on team map</Link>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Stats + Map */}
      <div className="grid gap-6 md:grid-cols-[2fr,3fr]">
        {/* Stats card */}
        <Card>
          <CardHeader>
            <CardTitle>Riding summary</CardTitle>
            <CardDescription>
              Basic stats for {member.name}&apos;s rides in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total rides</p>
                <p className="text-xl font-semibold">{totalRides}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total distance</p>
                <p className="text-xl font-semibold">
                  {totalDistanceRounded} km
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Rides last 30 days
                </p>
                <p className="text-xl font-semibold">{ridesLastMonth}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Last ride</p>
                <p className="text-sm font-medium">
                  {lastRide
                    ? formatRideDate(lastRide.startDate)
                    : "No rides yet"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map card */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Routes</CardTitle>
            <CardDescription>
              All recorded routes ridden by {member.name}.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {routes.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                No routes recorded yet for this rider.
              </div>
            ) : (
              <div className="h-64">
                <MemberRoutesMap routes={routes} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent rides list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent rides</h2>
          {totalRides > 5 && (
            <p className="text-xs text-muted-foreground">
              Showing last 5 of {totalRides} total rides.
            </p>
          )}
        </div>
        <Separator />
        {member.rides.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No rides have been recorded yet for this member.
          </p>
        ) : (
          <div className="space-y-2">
            {member.rides.slice(0, 5).map((ride) => {
              const distanceKm =
                typeof ride.distanceMeters === "number"
                  ? ride.distanceMeters / 1000
                  : null;

              const durationLabel = formatDurationFromSeconds(
                ride.movingTimeSec ?? ride.elapsedTimeSec
              );

              return (
                <div
                  key={ride.id}
                  className="flex flex-col justify-between gap-1 rounded-lg border px-4 py-2 text-sm md:flex-row md:items-center"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {formatRideDate(ride.startDate)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Duration: {durationLabel}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {distanceKm
                      ? `${distanceKm.toFixed(1)} km`
                      : "Distance unknown"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}