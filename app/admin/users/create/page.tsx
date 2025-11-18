import { requireAdmin } from "@/lib/auth"
import { createAdminAction } from "./action"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CreateAdminPage() {
  // Protect this page – only admins can see it
  await requireAdmin()

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="mb-4">
        <Link
          href="/admin/users"
          className="text-sm text-slate-400 hover:text-slate-100"
        >
          ← Back to admin users
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAdminAction} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name (optional)</Label>
              <Input id="name" name="name" placeholder="Admin name" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Set a password"
              />
            </div>

            <Button type="submit">Create admin</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}