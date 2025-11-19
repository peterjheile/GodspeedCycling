"use client";

import { useMemo, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Import the type only, not the component itself
import type { Route as MapRoute } from "./RoutesMap";

type FilterableRoute = MapRoute & {
  memberId: string;
  memberName: string;
  startedAt: string; // ISO string
  distanceKm: number | null;
};

type MemberOption = {
  id: string;
  name: string;
};

type TimeRange = "week" | "month" | "year" | "all";

type MapWithFiltersProps = {
  routes: FilterableRoute[];
  members: MemberOption[];
};

// ✅ Dynamically import the Leaflet map component with ssr: false
const RoutesMap = dynamic(() => import("./RoutesMap"), {
  ssr: false,
}) as ComponentType<{ routes: MapRoute[] }>;

function getThreshold(range: TimeRange): Date | null {
  const now = new Date();
  switch (range) {
    case "week": {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d;
    }
    case "month": {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      return d;
    }
    case "year": {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() - 1);
      return d;
    }
    case "all":
    default:
      return null;
  }
}

export default function MapWithFilters({
  routes,
  members,
}: MapWithFiltersProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  const filteredRoutes = useMemo(() => {
    const threshold = getThreshold(timeRange);

    return routes.filter((route) => {
      if (selectedMemberId !== "all" && route.memberId !== selectedMemberId) {
        return false;
      }

      if (threshold) {
        const started = new Date(route.startedAt);
        if (started < threshold) return false;
      }

      return true;
    });
  }, [routes, selectedMemberId, timeRange]);

  const routesForMap: MapRoute[] = useMemo(
    () =>
      filteredRoutes.map((r) => ({
        id: r.id,
        label: r.label,
        positions: r.positions,
      })),
    [filteredRoutes]
  );

  const rideCount = filteredRoutes.length;

  const selectedMemberName =
    selectedMemberId === "all"
      ? "All riders"
      : members.find((m) => m.id === selectedMemberId)?.name ?? "Unknown rider";

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Routes map</h1>
          <p className="text-sm text-muted-foreground">
            Visualize routes by rider and timeframe.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Showing:</span>
            <Badge variant="outline" className="font-normal">
              {selectedMemberName}
            </Badge>
            <Badge variant="outline" className="font-normal">
              {timeRange === "week" && "Last 7 days"}
              {timeRange === "month" && "Last 30 days"}
              {timeRange === "year" && "Last 12 months"}
              {timeRange === "all" && "All time"}
            </Badge>
            <Badge variant="outline" className="font-normal">
              {rideCount} ride{rideCount === 1 ? "" : "s"}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Member filter */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              Rider
            </span>
            <Select
              value={selectedMemberId}
              onValueChange={(value) => setSelectedMemberId(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select rider" />
              </SelectTrigger>
              <SelectContent className="z-[1001]">
                <SelectItem value="all">All riders</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time range filter */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              Time range
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                size="sm"
                variant={timeRange === "week" ? "default" : "outline"}
                onClick={() => setTimeRange("week")}
              >
                1w
              </Button>
              <Button
                type="button"
                size="sm"
                variant={timeRange === "month" ? "default" : "outline"}
                onClick={() => setTimeRange("month")}
              >
                1m
              </Button>
              <Button
                type="button"
                size="sm"
                variant={timeRange === "year" ? "default" : "outline"}
                onClick={() => setTimeRange("year")}
              >
                1y
              </Button>
              <Button
                type="button"
                size="sm"
                variant={timeRange === "all" ? "default" : "outline"}
                onClick={() => setTimeRange("all")}
              >
                All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Map */}
      <div className="h-[500px] rounded-lg border overflow-hidden">
        <RoutesMap routes={routesForMap} />
      </div>
    </div>
  );
}