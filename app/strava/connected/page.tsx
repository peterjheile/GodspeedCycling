import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { syncAllStravaRidesForMember } from "@/lib/strava-client";
import { prisma } from "@/lib/db";

type PageProps = {
  searchParams: Promise <{ memberId?: string }>
}

export default async function StravaConnectedPage({ searchParams }: PageProps) {
  const { memberId } = await searchParams;

  if (!memberId) {
    return <div>Missing memberId in URL.</div>;
  }

  // 1️⃣ Get the Member this link belongs to
  const member = await prisma.member.findUnique({
    where: { id: memberId },
  });

  if (!member) {
    return <div>Member not found.</div>;
  }

  // 2️⃣ Grab the most recently created Strava Account
  // (created automatically by StravaProvider + PrismaAdapter)
  const stravaAccount = await prisma.account.findFirst({
    where: { provider: "strava" },
    orderBy: { createdAt: "desc" }, // assumes default NextAuth schema
  });

  if (!stravaAccount) {
    return <div>No Strava account found. Something went wrong with OAuth.</div>;
  }

  // 3️⃣ Copy Strava tokens + athlete ID onto the Member
  const updatedMember = await prisma.member.update({
    where: { id: member.id },
    data: {
      stravaAthleteId: stravaAccount.providerAccountId,
      stravaAccessToken: stravaAccount.access_token,
      stravaRefreshToken: stravaAccount.refresh_token,
      stravaTokenExpiresAt: stravaAccount.expires_at
        ? new Date(stravaAccount.expires_at * 1000)
        : null,
      stravaConnectedAt: new Date(),
      stravaInviteToken: null,
      stravaInviteExpiresAt: null,
    },
  });

  // 4️⃣ Now that the Member has tokens, backfill all historical rides
  await syncAllStravaRidesForMember(updatedMember);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Strava authorization complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            If you approved the request on Strava, your account is now linked
            to the Godspeed Cycling team site.
          </p>
          <p>
            Your past rides have been synced, and new rides will sync
            automatically.
          </p>
          {memberId && (
            <p className="text-xs">
              (Internal note: linked for member ID{" "}
              <span className="font-mono text-foreground">{memberId}</span>)
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}