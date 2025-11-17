import { prisma } from "@/lib/db";
import { EventType } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type PageProps = {
  // In your setup, params is a Promise
  params: Promise<{
    id: string;
  }>;
};

function typeToLabel(type: EventType) {
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

function formatDateRange(start: Date, end?: Date | null) {
  const startStr = start.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  if (!end) return startStr;

  const sameDay = start.toDateString() === end.toDateString();

  const endStr = end.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    ...(sameDay ? {} : { month: "short", day: "numeric" }),
  });

  return `${startStr} – ${endStr}`;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    notFound();
  }

  const startAt = new Date(event.startAt);
  const endAt = event.endAt ? new Date(event.endAt) : null;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {event.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatDateRange(startAt, endAt)}
            {event.location && (
              <>
                {" · "}
                <span className="font-medium">{event.location}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge>{typeToLabel(event.type)}</Badge>
          <Button asChild variant="outline" size="sm">
            <Link href="/events">Back to events</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/events/${event.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Event overview</CardTitle>
          <CardDescription>
            High-level details for this Godspeed event.
          </CardDescription>
        </CardHeader>
      </Card>

      {event.description ? (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {event.description}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No detailed description has been added yet.
        </p>
      )}
    </div>
  );
}