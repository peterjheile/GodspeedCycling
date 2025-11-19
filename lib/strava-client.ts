import { prisma } from "@/lib/db";
import type { Member } from "@prisma/client";

const STRAVA_BASE_URL = "https://www.strava.com/api/v3";
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID!;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET!;

// --- Token helpers ---

function isTokenExpired(member: Member) {
  if (!member.stravaTokenExpiresAt) return true;
  // Add 60s buffer
  return member.stravaTokenExpiresAt.getTime() < Date.now() + 60_000;
}

async function refreshStravaToken(member: Member): Promise<Member> {
  if (!member.stravaRefreshToken) {
    throw new Error("No refresh token for member " + member.id);
  }

  const url =
    `https://www.strava.com/oauth/token` +
    `?client_id=${STRAVA_CLIENT_ID}` +
    `&client_secret=${STRAVA_CLIENT_SECRET}` +
    `&grant_type=refresh_token` +
    `&refresh_token=${member.stravaRefreshToken}`;

  const res = await fetch(url, { method: "POST" });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to refresh Strava token", text);
    throw new Error("Failed to refresh Strava token");
  }

  const data = await res.json();

  const updated = await prisma.member.update({
    where: { id: member.id },
    data: {
      stravaAccessToken: data.access_token,
      stravaRefreshToken: data.refresh_token,
      stravaTokenExpiresAt: new Date(data.expires_at * 1000),
    },
  });

  return updated;
}

async function getValidAccessToken(member: Member): Promise<Member> {
  if (!member.stravaAccessToken || isTokenExpired(member)) {
    return refreshStravaToken(member);
  }
  return member;
}

// --- Activity fetch + map to Ride ---
function mapStravaActivityToRideData(activity: any, memberId: string) {
  const map = activity.map ?? {};
  const polyline: string | null =
    map.summary_polyline ?? map.polyline ?? null;

  return {
    memberId,
    stravaActivityId: String(activity.id),
    name: activity.name ?? "Ride",
    type: activity.sport_type ?? activity.type ?? "Ride",
    distanceMeters: activity.distance ?? 0,
    movingTimeSec: activity.moving_time ?? 0,
    elapsedTimeSec: activity.elapsed_time ?? 0,
    elevationGain: activity.total_elevation_gain ?? 0,
    startDate: new Date(activity.start_date),

    avgSpeed: activity.average_speed ?? null,
    maxSpeed: activity.max_speed ?? null,
    calories: activity.kilojoules
      ? activity.kilojoules
      : activity.calories ?? null,

    polyline,
  };
}



export async function upsertRideFromStravaActivity(opts: {
  member: Member;
  stravaActivityId: number;
}) {
  let member = await getValidAccessToken(opts.member);

  const res = await fetch(
    `${STRAVA_BASE_URL}/activities/${opts.stravaActivityId}`,
    {
      headers: {
        Authorization: `Bearer ${member.stravaAccessToken}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(
      "Failed to fetch Strava activity",
      opts.stravaActivityId,
      text
    );
    return;
  }

  const activity = await res.json();
  const rideData = mapStravaActivityToRideData(activity, member.id);

  await prisma.ride.upsert({
    where: { stravaActivityId: rideData.stravaActivityId },
    update: rideData,
    create: rideData,
  });
}

export async function syncAllStravaRidesForMember(member: Member) {
  // Make sure token is valid
  let authMember = await getValidAccessToken(member);

  const perPage = 100; // you can go up to 200
  let page = 1;

  while (true) {
    const url = new URL(`${STRAVA_BASE_URL}/athlete/activities`);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${authMember.stravaAccessToken}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Failed to list Strava activities", text);
      break;
    }

    const activities = await res.json();

    if (!Array.isArray(activities) || activities.length === 0) {
      // No more activities
      break;
    }

    // Upsert each activity into Ride
    for (const activity of activities) {
      console.log("Synching ride: ", activity);
      const rideData = mapStravaActivityToRideData(activity, authMember.id);

      await prisma.ride.upsert({
        where: { stravaActivityId: rideData.stravaActivityId },
        update: rideData,
        create: rideData,
      });
    }

    page += 1;
  }
}