import { prisma } from "@/lib/db";
import { EventType } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  TRAINING: "Training",
  RACE: "Race",
  SOCIAL: "Social",
  OTHER: "Other",
};

// NOTE: params is a Promise in your Next.js version
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function updateEvent(id: string, formData: FormData) {
  "use server";

  const name = (formData.get("name") ?? "").toString().trim();
  const description =
    (formData.get("description") ?? "").toString().trim() || null;
  const location =
    (formData.get("location") ?? "").toString().trim() || null;
  const typeRaw = (formData.get("type") ?? "").toString().trim() as
    | EventType
    | "";
  const startAtRaw = (formData.get("startAt") ?? "").toString().trim();
  const endAtRaw = (formData.get("endAt") ?? "").toString().trim();

  if (!name || !typeRaw || !startAtRaw) {
    throw new Error("Missing required fields");
  }

  const startAt = new Date(startAtRaw);
  const endAt = endAtRaw ? new Date(endAtRaw) : null;

  await prisma.event.update({
    where: { id },
    data: {
      name,
      description,
      location,
      type: typeRaw,
      startAt,
      endAt,
    },
  });

  redirect("/events");
}

export default async function EditEventPage({ params }: PageProps) {
  // 🔑 Unwrap params (it's a Promise)
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

  const startAtValue = event.startAt.toISOString().slice(0, 16);
  const endAtValue = event.endAt
    ? event.endAt.toISOString().slice(0, 16)
    : "";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-muted-foreground">
            Update details for{" "}
            <span className="font-semibold">{event.name}</span>.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/events">Back to events</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event details</CardTitle>
          <CardDescription>
            Adjust the information below and save your changes.
          </CardDescription>
        </CardHeader>

        {/* Bind the server action to this specific event id */}
        <form action={updateEvent.bind(null, id)}>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Event name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={event.name}
                required
              />
            </div>

            {/* Type + Location */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select name="type" defaultValue={event.type}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EventType).map((t) => (
                      <SelectItem key={t} value={t}>
                        {EVENT_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={event.location ?? ""}
                  placeholder="Downtown Bloomington"
                />
              </div>
            </div>

            {/* Start/End */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startAt">Start time</Label>
                <Input
                  id="startAt"
                  name="startAt"
                  type="datetime-local"
                  required
                  defaultValue={startAtValue}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endAt">End time (optional)</Label>
                <Input
                  id="endAt"
                  name="endAt"
                  type="datetime-local"
                  defaultValue={endAtValue}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={event.description ?? ""}
                rows={4}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link href="/events">Cancel</Link>
            </Button>

            <Button type="submit">Save changes</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}