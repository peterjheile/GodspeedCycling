import { Prisma, MemberRole } from "@prisma/client"
import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StravaInviteSection } from "./StravaInviteSection"

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

// --- Server action: update an existing member ---
async function updateMemberAction(formData: FormData) {
  "use server"

  await requireAdmin()

  const memberId = (formData.get("memberId") || "").toString()
  const name = (formData.get("name") || "").toString().trim()
  const emailRaw = (formData.get("email") || "").toString().trim()
  const role = (formData.get("role") || "").toString() as MemberRole
  const avatarUrlRaw = (formData.get("avatarUrl") || "").toString().trim()
  const bioRaw = (formData.get("bio") || "").toString().trim()

  if (!memberId) {
    redirect("/admin/members?error=Invalid%20member%20id")
  }

  if (!name) {
    redirect(`/admin/members/${memberId}?error=Name%20is%20required`)
  }

  const email = emailRaw === "" ? null : emailRaw
  const avatarUrl = avatarUrlRaw === "" ? null : avatarUrlRaw
  const bio = bioRaw === "" ? null : bioRaw

  try {
    await prisma.member.update({
      where: { id: memberId },
      data: {
        name,
        email,
        role: role || MemberRole.RIDER,
        avatarUrl,
        bio,
      },
    })
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      redirect(
        `/admin/members/${memberId}?error=That%20email%20is%20already%20used%20by%20another%20member`
      )
    }
    console.error(err)
    redirect(
      `/admin/members/${memberId}?error=Something%20went%20wrong.%20Please%20try%20again.`
    )
  }

  revalidatePath("/admin/members")
  revalidatePath("/members")

  redirect("/admin/members")
}

type PageProps = {
  params: Promise <{ id: string, error?: string }>
}

export default async function EditMemberPage({params}: PageProps) {
  const { id, error } = await params;

  await requireAdmin()

  const member = await prisma.member.findUnique({
    where: { id },
  })

  if (!member) {
    notFound()
  }


  const initialInviteUrl = member.stravaInviteToken
    ? `${BASE_URL}/strava/connect?token=${member.stravaInviteToken}`
    : null

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Member
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Update details for {member.name}.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/members">Back to members</Link>
        </Button>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 text-sm rounded-md px-4 py-3">
          {decodeURIComponent(error)}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Member details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateMemberAction} className="space-y-6">
            <input type="hidden" name="memberId" value={member.id} />

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={member.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email{" "}
                <span className="text-xs text-muted-foreground">
                  (optional, but needed for Strava invites later)
                </span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={member.email ?? ""}
                placeholder="rider@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                defaultValue={member.role}
                className="border rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value={MemberRole.RIDER}>Rider</option>
                <option value={MemberRole.COACH}>Coach</option>
                <option value={MemberRole.MECHANIC}>Mechanic</option>
                <option value={MemberRole.MANAGER}>Manager</option>
                <option value={MemberRole.ALUMNI}>Alumni</option>
                <option value={MemberRole.OTHER}>Staff / Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl">
                Avatar URL{" "}
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                defaultValue={member.avatarUrl ?? ""}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">
                Bio{" "}
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue={member.bio ?? ""}
                placeholder="Short intro or notes about this rider."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                asChild
              >
                <Link href="/admin/members">Cancel</Link>
              </Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <StravaInviteSection
        memberId={member.id}
        initialInviteUrl={initialInviteUrl}
      />
    </div>
  )
}