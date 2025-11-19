"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  memberId: string
}

export function StravaConnectStart({ memberId }: Props) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)

    // Start Strava OAuth via NextAuth.
    // After Strava completes, it will redirect back to /strava/connected
    // with the memberId in the query so we know who this is for.
    await signIn("strava", {
      callbackUrl: `/strava/connected?memberId=${memberId}`,
    })
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full"
    >
      {loading ? "Redirecting to Strava..." : "Connect with Strava"}
    </Button>
  )
}