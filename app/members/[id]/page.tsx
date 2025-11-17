import { prisma } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";

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
import RoutesMap, { Route as MapRoute } from "@/components/map/RoutesMap";

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

export default async function MemberProfilePage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      rides: {
        orderBy: { startedAt: "desc" },
      },
    },
  });

  if (!member) {
    notFound();
  }

  // Build routes for this member's rides
  const routes: MapRoute[] = [];
  let totalDistance = 0;
  const now = new Date();

  for (const ride of member.rides) {
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

    const dateLabel = ride.startedAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const distance = ride.distanceKm ?? 0;
    totalDistance += distance;

    routes.push({
      id: ride.id,
      label:
        distance > 0
          ? `${dateLabel} · ${distance.toFixed(1)} km`
          : dateLabel,
      positions,
    });
  }

  const totalRides = member.rides.length;
  const lastRide = member.rides[0] ?? null;

  // optional: last 30 days stats
  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const ridesLastMonth = member.rides.filter(
    (r) => r.startedAt >= monthAgo
  ).length;

  const totalDistanceRounded = totalDistance > 0 ? totalDistance.toFixed(1) : "0.0";

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
                <p className="text-xs text-muted-foreground">
                  Total rides
                </p>
                <p className="text-xl font-semibold">
                  {totalRides}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Total distance
                </p>
                <p className="text-xl font-semibold">
                  {totalDistanceRounded} km
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Rides last 30 days
                </p>
                <p className="text-xl font-semibold">
                  {ridesLastMonth}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Last ride
                </p>
                <p className="text-sm font-medium">
                  {lastRide
                    ? formatRideDate(lastRide.startedAt)
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
                <RoutesMap routes={routes} />
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
            {member.rides.slice(0, 5).map((ride) => (
              <div
                key={ride.id}
                className="flex flex-col justify-between gap-1 rounded-lg border px-4 py-2 text-sm md:flex-row md:items-center"
              >
                <div className="space-y-1">
                  <p className="font-medium">
                    {formatRideDate(ride.startedAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Duration:{" "}
                    {ride.endedAt
                      ? `${Math.round(
                          (ride.endedAt.getTime() -
                            ride.startedAt.getTime()) /
                            (1000 * 60)
                        )} min`
                      : "Unknown"}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {ride.distanceKm
                    ? `${ride.distanceKm.toFixed(1)} km`
                    : "Distance unknown"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}