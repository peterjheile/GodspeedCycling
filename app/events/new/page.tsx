import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { EventType } from "@prisma/client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  TRAINING: "Training",
  RACE: "Race",
  SOCIAL: "Social",
  OTHER: "Other",
};

async function createEvent(formData: FormData) {
  "use server";

  const name = (formData.get("name") ?? "").toString().trim();
  const description = (formData.get("description") ?? "").toString().trim() || null;
  const location = (formData.get("location") ?? "").toString().trim() || null;
  const typeRaw = (formData.get("type") ?? "").toString().trim() as EventType | "";
  const startAtRaw = (formData.get("startAt") ?? "").toString().trim();
  const endAtRaw = (formData.get("endAt") ?? "").toString().trim();

  if (!name || !typeRaw || !startAtRaw) {
    // In a real app you’d return errors, but for now just blow up
    throw new Error("Missing required fields");
  }

  const startAt = new Date(startAtRaw);
  const endAt = endAtRaw ? new Date(endAtRaw) : null;

  await prisma.event.create({
    data: {
      name,
      description,
      location,
      type: typeRaw,
      startAt,
      endAt,
    },
  });

  // After creation, go back to the Events list
  redirect("/events");
}

export default function NewEventPage() {
  const defaultStart = new Date();
  // Round to the nearest 30 minutes for nicer default
  defaultStart.setMinutes(defaultStart.getMinutes() - (defaultStart.getMinutes() % 30), 0, 0);

  const defaultStartValue = defaultStart.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
        <p className="text-muted-foreground">
          Admin-only form to add races, training rides, and socials for the Godspeed team.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Event</CardTitle>
          <CardDescription>
            Fill out the details and save. You&apos;ll see it immediately on the Events page.
          </CardDescription>
        </CardHeader>

        <form action={createEvent}>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Event name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Tuesday Night Worlds"
                required
              />
            </div>

            {/* Type + Location */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                {/* Select uses a hidden input under the hood when used with name on the Trigger */}
                <Select name="type" defaultValue={EventType.TRAINING}>
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
                  defaultValue={defaultStartValue}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endAt">End time (optional)</Label>
                <Input
                  id="endAt"
                  name="endAt"
                  type="datetime-local"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Hard race-simulation workout. Warmup to Sample Gates, 4x loop, cool down back to campus..."
                rows={4}
              />
            </div>
          </CardContent>
            <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
                <Link href="/events">
                Cancel
                </Link>
            </Button>

            <Button type="submit">
                Create event
            </Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}