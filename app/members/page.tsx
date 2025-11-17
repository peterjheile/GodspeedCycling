import { prisma} from "@/lib/db";
import Link from "next/link";
import { MemberRole } from "@prisma/client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";



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

export default async function TeamPage() {
  const members = await prisma.member.findMany({
    orderBy: { name: "asc" },
  });

  return (
      <div className="max-w-5xl mx-auto py-10 space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground mt-1">
            Riders, coaches, mechanics, and alumni of Godspeed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {members.map((member) => (
            <Card key={member.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                      <CardTitle className="flex items-center justify-between">
      <Link
        href={`/members/${member.id}`}
        className="hover:underline"
      >
        {member.name}
      </Link>
      <Badge variant="outline">{roleToLabel(member.role)}</Badge>
    </CardTitle>
                  {member.email && (
                    <CardDescription>{member.email}</CardDescription>
                  )}
                </div>

                <Badge variant="outline" className="uppercase">
                  {member.role}
                </Badge>
              </CardHeader>

              {member.bio && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
  );
}