import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { upsertRideFromStravaActivity } from "@/lib/strava-client";

const STRAVA_VERIFY_TOKEN = process.env.STRAVA_VERIFY_TOKEN!;

// 1) Strava verification for subscription creation
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const challenge = searchParams.get("hub.challenge");
  const verifyToken = searchParams.get("hub.verify_token");

  if (mode === "subscribe" && verifyToken === STRAVA_VERIFY_TOKEN) {
    // Echo back the challenge so Strava accepts the subscription
    return NextResponse.json({ "hub.challenge": challenge }, { status: 200 });
  }

  return NextResponse.json({ error: "Invalid verify token" }, { status: 403 });
}

// 2) Event handler: Strava sends POSTs here for activities
export async function POST(req: NextRequest) {
  // Strava sends either a single event or an array, but most examples are single
  const body = await req.json();

  const event = Array.isArray(body) ? body[0] : body;

  const {
    object_type,
    aspect_type,
    object_id, // activity ID
    owner_id, // athlete ID
  } = event;

  // For debugging while you test:
  console.log("Strava webhook event:", event);

  // We only care about newly created activities right now
  if (object_type === "activity" && aspect_type === "create") {
    try {
      // Find the member with this Strava athlete ID
      const member = await prisma.member.findFirst({
        where: {
          stravaAthleteId: String(owner_id),
        },
      });

      if (!member) {
        console.warn("Strava event for unknown athlete", owner_id);
        // Still return 200 so Strava doesn't keep retrying
        return NextResponse.json({ ok: true }, { status: 200 });
      }

      // Fetch and upsert the ride
      await upsertRideFromStravaActivity({
        member,
        stravaActivityId: object_id,
      });
    } catch (err) {
      console.error("Error processing Strava webhook event", err);
      // You STILL should return 200 quickly so Strava doesn't spam you.
      // Handle real error reporting/logging elsewhere if needed.
      return NextResponse.json({ ok: true }, { status: 200 });
    }
  }

  // For update/delete, you can later add extra logic if you want.
  // For now just accept.
  return NextResponse.json({ ok: true }, { status: 200 });
}