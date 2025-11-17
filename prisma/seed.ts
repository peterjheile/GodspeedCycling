import { PrismaClient, EventType} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.event.deleteMany();
  await prisma.event.createMany({
    data: [
      {
        name: "Team Ride — Campus Loops",
        description: "Easy-paced group ride around campus and surrounding roads.",
        startAt: new Date("2025-03-15T10:00:00-05:00"),
        endAt: new Date("2025-03-15T12:00:00-05:00"),
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
    ],
  });

  await prisma.member.deleteMany();
  await prisma.member.createMany({
    data: [
      {
        name: "Peter Heile",
        email: "peter@example.com",
        role: "RIDER",
      },
      {
        name: "Alex Johnson",
        email: "alex@example.com",
        role: "COACH",
      },
      {
        name: "Sam Lee",
        email: "sam@example.com",
        role: "MECHANIC",
      },
    ],
  });



}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });