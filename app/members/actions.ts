"use server"

import { requireAdmin } from "@/lib/auth"
import { createOrRefreshStravaInvite } from "@/lib/stravaInvite"

export async function generateStravaInviteAction(memberId: string) {
  await requireAdmin()

  const { inviteUrl } = await createOrRefreshStravaInvite(memberId)

  // Keep response simple and serializable
  return { inviteUrl }
}