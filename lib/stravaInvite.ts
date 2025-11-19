import { prisma } from "@/lib/db"
import { randomBytes } from "crypto"

const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

export async function createOrRefreshStravaInvite(memberId: string) {
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS)

  const updated = await prisma.member.update({
    where: { id: memberId },
    data: {
      stravaInviteToken: token,
      stravaInviteExpiresAt: expiresAt,
    },
  })

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  const inviteUrl = `${baseUrl}/strava/connect?token=${token}`

  return { inviteUrl, member: updated }
}