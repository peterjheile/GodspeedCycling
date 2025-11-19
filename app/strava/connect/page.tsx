import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { StravaConnectStart } from "./StravaConnectStart"

type PageProps = {
  searchParams: Promise <{ token?: string }>
}

export default async function StravaConnectPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    notFound()
  }

  const member = await prisma.member.findFirst({
    where: {
      stravaInviteToken: token,
    },
  })

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Invalid or expired link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              This Strava connection link is invalid or has expired.
            </p>
            <p>
              Please contact your team staff or coach and ask them to send you
              a new invite.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Optional: basic expiry check if you’re setting stravaInviteExpiresAt
  if (member.stravaInviteExpiresAt && member.stravaInviteExpiresAt < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Link expired</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              This Strava connection link has expired.
            </p>
            <p>
              Please contact your team staff or coach to request a new invite.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Connect Strava for {member.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            You&apos;re about to connect your Strava account so Godspeed
            Cycling can show your rides and stats on the team site.
          </p>
          {member.email && (
            <p>
              Rider email on file:{" "}
              <span className="font-medium text-foreground">
                {member.email}
              </span>
            </p>
          )}
          <p>
            On the next screen, Strava will ask you to authorize access. You
            can revoke this later from your Strava account settings.
          </p>

          <StravaConnectStart
            memberId={member.id}
          />
        </CardContent>
      </Card>
    </div>
  )
}