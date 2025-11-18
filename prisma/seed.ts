import { PrismaClient, EventType, MemberRole } from "@prisma/client";
import bcrypt from "bcryptjs"

const prisma = new PrismaClient();

async function main() {
  await prisma.event.deleteMany();
  await prisma.ride.deleteMany()
  await prisma.member.deleteMany();


  await prisma.event.createMany({
    data: [
      {
        name: "Team Ride — Campus Loops",
        description: "Easy-paced group ride around campus and surrounding roads.",
        startAt: new Date("2026-03-15T10:00:00-05:00"),
        endAt: new Date("2026-03-15T12:00:00-05:00"),
        location: "IU Campus",
        type: EventType.TRAINING,
      },
      {
        name: "Little 500 Practice",
        description: "Track session with pacelines, exchanges, and sprint work.",
        startAt: new Date("2025-03-18T16:00:00-05:00"),
        endAt: new Date("2025-03-18T18:00:00-05:00"),
        location: "Bill Armstrong Stadium",
        type: EventType.TRAINING,
      },
      {
        name: "Local Crit Race",
        description: "Short, technical crit race. Great race simulation.",
        startAt: new Date("2025-04-05T09:00:00-05:00"),
        endAt: new Date("2025-04-05T11:00:00-05:00"),
        location: "Bloomington Industrial Park",
        type: EventType.RACE,
      },
      {
        name: "Team Dinner",
        description: "Post-ride team dinner. Bring your favorite carb.",
        startAt: new Date("2025-03-20T19:00:00-05:00"),
        endAt: null,
        location: "Peter's House",
        type: EventType.SOCIAL,
      },
      {
        name: "Tuesday Night Worlds",
        description: "Hard training race simulation around Bloomington loop.",
        startAt: new Date("2025-04-08T17:30:00"),
        endAt: new Date("2025-04-08T19:00:00"),
        location: "Sample Gates -> Bean Blossom loop",
        type: EventType.TRAINING,
      },
      {
        name: "Bloomington Crit",
        description: "Downtown criterium, 45 minutes + 3 laps.",
        startAt: new Date("2025-04-20T14:00:00"),
        endAt: new Date("2025-04-20T15:30:00"),
        location: "Downtown Bloomington",
        type: EventType.RACE,
      },
      {
        name: "Team Social Ride & Coffee",
        description: "Easy spin and post-ride coffee. No-drop, all levels.",
        startAt: new Date("2025-04-12T10:00:00"),
        endAt: new Date("2025-04-12T12:00:00"),
        location: "Hopscotch Coffee",
        type: EventType.SOCIAL,
      },
    ],
  });

  const peter = await prisma.member.create({
      data: {
        name: "Peter Heile",
        email: "peter@example.com",
        role: MemberRole.RIDER,
      },
    });

    const alex = await prisma.member.create({
      data: {
        name: "Alex Johnson",
        email: "alex@example.com",
        role: MemberRole.COACH,
      },
    });

    const sam = await prisma.member.create({
      data: {
        name: "Sam Lee",
        email: "sam@example.com",
        role: MemberRole.RIDER,
      },
    });



  // helper to get “n days ago”
  const now = new Date();
  const daysAgo = (n: number) =>
    new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

  // --- Rides ---
  await prisma.ride.createMany({
    data: [
      {
        memberId: peter.id,
        startedAt: daysAgo(3),
        endedAt: daysAgo(3),
        distanceKm: 25.4,
        polyline: JSON.stringify([
          [39.1679, -86.523],
          [39.1695, -86.518],
          [39.171, -86.522],
          [39.169, -86.526],
          [39.1679, -86.523],
        ]),
      },
      {
        memberId: sam.id,
        startedAt: daysAgo(7),
        endedAt: daysAgo(7),
        distanceKm: 18.2,
        polyline: JSON.stringify([
          [39.1705, -86.526],
          [39.1712, -86.523],
          [39.17, -86.52],
          [39.1688, -86.522],
          [39.1705, -86.526],
        ]),
      },
      {
        memberId: peter.id,
        startedAt: daysAgo(10),
        endedAt: daysAgo(10),
        distanceKm: 40.7,
        polyline: JSON.stringify([
          [39.167, -86.535],
          [39.1685, -86.54],
          [39.17, -86.538],
          [39.1712, -86.532],
          [39.1679, -86.523],
        ]),
      },
    ],
  });


  const adminPassword = "godspeed-admin" // pick whatever you want

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10)

  await prisma.user.upsert({
    where: { email: "admin1@godspeed.dev" },
    update: {
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
    create: {
      email: "admin1@godspeed.dev",
      name: "Godspeed Admin 1",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
  })

  await prisma.user.upsert({
    where: { email: "admin2@godspeed.dev" },
    update: {
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
    create: {
      email: "admin2@godspeed.dev",
      name: "Godspeed Admin 2",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
  })


}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });