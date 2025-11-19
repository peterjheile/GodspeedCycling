import Link from "next/link";
import { revalidatePath } from "next/cache";
import { MemberRole } from "@prisma/client";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import {
  disconnectMemberStravaById,
  deleteMemberStravaDataById,
} from "@/lib/member-strava";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

// --- Server action: delete entire member ---
async function deleteMemberAction(formData: FormData) {
  "use server";

  await requireAdmin();

  const memberId = formData.get("memberId");
  if (!memberId || typeof memberId !== "string") {
    throw new Error("Invalid member id");
  }

  await prisma.member.delete({
    where: { id: memberId },
  });

  // Revalidate admin list and public team page
  revalidatePath("/admin/members");
  revalidatePath("/members");
}

// --- Server action: disconnect Strava for a member ---
async function disconnectStravaAction(formData: FormData) {
  "use server";

  await requireAdmin();

  const memberId = formData.get("memberId");
  if (!memberId || typeof memberId !== "string") {
    throw new Error("Invalid member id");
  }

  await disconnectMemberStravaById(memberId);

  revalidatePath("/admin/members");
  revalidatePath("/members");
}

// --- Server action: delete Strava data for a member ---
async function deleteStravaDataAction(formData: FormData) {
  "use server";

  await requireAdmin();

  const memberId = formData.get("memberId");
  if (!memberId || typeof memberId !== "string") {
    throw new Error("Invalid member id");
  }

  await deleteMemberStravaDataById(memberId);

  revalidatePath("/admin/members");
  revalidatePath("/members");
}

export default async function AdminMembersPage() {
  await requireAdmin();

  const members = await prisma.member.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Team Members
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Add, edit, or remove riders, coaches, and staff.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/members/new">Add member</Link>
        </Button>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No members yet. Click &quot;Add member&quot; to create your first
          rider.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {members.map((member) => {
            const hasStrava = !!member.stravaAthleteId;

            return (
              <Card key={member.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="flex flex-wrap items-center gap-2">
                      <span>{member.name}</span>
                      <Badge variant="outline">
                        {roleToLabel(member.role)}
                      </Badge>
                      {hasStrava && (
                        <Badge
                          className="bg-emerald-500/10 text-emerald-700 border-emerald-500/40"
                        >
                          ● Strava connected
                        </Badge>
                      )}
                    </CardTitle>

                    {member.email && (
                      <CardDescription>{member.email}</CardDescription>
                    )}
                  </div>

                  <Badge variant="outline" className="uppercase text-[10px]">
                    {member.role}
                  </Badge>
                </CardHeader>

                {member.bio && (
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                  </CardContent>
                )}

                <CardContent className="pt-0 flex flex-col gap-2">
                  {/* Top row: Strava controls (if connected) */}
                  {hasStrava && (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground">
                        Strava connection controls
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <form action={disconnectStravaAction}>
                          <input
                            type="hidden"
                            name="memberId"
                            value={member.id}
                          />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                          >
                            Disconnect Strava
                          </Button>
                        </form>

                        <form action={deleteStravaDataAction}>
                          <input
                            type="hidden"
                            name="memberId"
                            value={member.id}
                          />
                          <Button
                            type="submit"
                            variant="destructive"
                            size="sm"
                          >
                            Delete Strava data
                          </Button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Bottom row: edit/delete member */}
                  <div className="flex justify-end gap-2 pt-1">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/members/${member.id}`}>Edit</Link>
                    </Button>

                    <form action={deleteMemberAction}>
                      <input
                        type="hidden"
                        name="memberId"
                        value={member.id}
                      />
                      <Button type="submit" variant="destructive" size="sm">
                        Delete
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}