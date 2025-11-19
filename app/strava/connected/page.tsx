import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type PageProps = {
  searchParams: Promise <{ memberId?: string }>
}

export default async function StravaConnectedPage({ searchParams }: PageProps) {
  const { memberId } = await searchParams;

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
            You can close this page. Your coaches or staff will be able to see
            your rides once syncing is fully set up.
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
  )
}