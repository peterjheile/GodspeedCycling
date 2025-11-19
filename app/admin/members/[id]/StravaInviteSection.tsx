"use client"

import { useState, useTransition } from "react"
import { generateStravaInviteAction } from "./action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  memberId: string
  initialInviteUrl: string | null
}

export function StravaInviteSection({ memberId, initialInviteUrl }: Props) {
  const [inviteUrl, setInviteUrl] = useState(initialInviteUrl)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = () => {
    setError(null)
    startTransition(async () => {
      try {
        const res = await generateStravaInviteAction(memberId)
        setInviteUrl(res.inviteUrl)
      } catch (err) {
        console.error(err)
        setError("Failed to generate invite link. Please try again.")
      }
    })
  }

  const handleCopy = async () => {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
    } catch (err) {
      console.error("Clipboard error", err)
    }
  }

  return (
    <section className="space-y-4 pt-8 mt-8 border-t">
      <h2 className="text-lg font-semibold">Strava Invite</h2>
      <p className="text-sm text-muted-foreground">
        Generate a unique link you can send to this rider so they can connect
        their Strava account. They won&apos;t need a login.
      </p>

      <Button disabled={isPending} onClick={handleGenerate}>
        {isPending ? "Generating..." : "Generate invite link"}
      </Button>

      {inviteUrl && (
        <div className="space-y-2">
          <Input
            readOnly
            value={inviteUrl}
            className="font-mono text-xs"
            onFocus={(e) => e.target.select()}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
            >
              Copy link
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This link expires in 7 days.
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 border border-red-200 bg-red-50 rounded-md px-3 py-2">
          {error}
        </p>
      )}
    </section>
  )
}