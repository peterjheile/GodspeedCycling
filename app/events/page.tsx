import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";
import { Button } from "@/components/ui/button";

function formatDateRange(start: Date, end?: Date | null) {
  const startStr = start.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  if (!end) return startStr;

  const sameDay =
    start.toDateString() === end.toDateString();

  const endStr = end.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    ...(sameDay ? {} : { month: "short", day: "numeric" }),
  });

  return `${startStr} – ${endStr}`;
}

function typeToBadge(type: string) {
  switch (type) {
    case "RACE":
      return "Race";
    case "TRAINING":
      return "Training";
    case "SOCIAL":
      return "Social";
    default:
      return "Other";
  }
}

export default async function EventsPage() {
  const now = new Date();

  const events = await prisma.event.findMany({
    orderBy: { startAt: "asc" },
  });

  const upcoming = events.filter((e) => e.startAt >= now);
  const past = events.filter((e) => e.startAt < now).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Events
        </h1>
        <p className="text-muted-foreground">
          Races, team rides, and social events for the Godspeed crew.
        </p>
          <Button asChild>
          <Link href="/events/new">
            + Create event
          </Link>
        </Button>
      </div>

      {/* Upcoming events */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Upcoming events</h2>
          <Badge variant="outline" className="text-white">
            {upcoming.length} scheduled
          </Badge>
        </div>
        <Separator />

        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No upcoming events. Check back soon, or bug a coach to schedule something 😄
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map((event) => (
              <Card key={event.id} className="flex flex-col h-full">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="line-clamp-1">
                      {event.name}
                    </CardTitle>
                    <Badge>
                      {typeToBadge(event.type)}
                    </Badge>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/events/${event.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  </div>
                  <CardDescription className="text-xs">
                    {formatDateRange(
                      new Date(event.startAt),
                      event.endAt ? new Date(event.endAt) : undefined
                    )}
                    {event.location && (
                      <>
                        {" · "}
                        <span className="font-medium">
                          {event.location}
                        </span>
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                {event.description && (
                  <div className="px-6 pb-4 text-sm text-muted-foreground line-clamp-3">
                    {event.description}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Past events */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Past events</h2>
          <Badge variant="outline" className="text-white">
            {past.length} completed
          </Badge>
        </div>
        <Separator />

        {past.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No past events yet — the season hasn&apos;t started.
          </p>
        ) : (
          <div className="space-y-3">
            {past.slice(0, 10).map((event) => (
              <div
                key={event.id}
                className="flex flex-col justify-between gap-2 rounded-lg border px-4 py-3 text-sm md:flex-row md:items-center"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {event.name}
                    </span>
                    <Badge variant="outline" className="text-[10px] text-white">
                      {typeToBadge(event.type)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDateRange(
                      new Date(event.startAt),
                      event.endAt ? new Date(event.endAt) : undefined
                    )}
                    {event.location && ` · ${event.location}`}
                  </p>
                </div>
                {event.description && (
                  <p className="text-xs text-muted-foreground md:max-w-md line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}