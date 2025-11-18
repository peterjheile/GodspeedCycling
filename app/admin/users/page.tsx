import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { updateUserRoleAction } from "./actions"

export default async function AdminUsersPage() {
  await requireAdmin()

  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
  })

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Users</h1>
        <Button asChild>
          <Link href="/admin/users/create">New admin</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-slate-400">
              No users found yet.
            </p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-md border border-slate-800 px-3 py-2 text-sm"
                >
                  <div>
                    <div className="font-medium">
                      {user.name || user.email || "Unnamed user"}
                    </div>
                    <div className="text-xs text-slate-400">
                      {user.email || "No email"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wide">
                      {user.role === "ADMIN" ? (
                        <span className="rounded-full border border-emerald-500/60 px-2 py-0.5 text-emerald-300">
                          ADMIN
                        </span>
                      ) : (
                        <span className="rounded-full border border-slate-600 px-2 py-0.5 text-slate-300">
                          USER
                        </span>
                      )}
                    </span>

                    {/* Promote / Demote buttons */}
                    {user.role === "ADMIN" ? (
                      <form action={updateUserRoleAction}>
                        <input type="hidden" name="userId" value={user.id} />
                        <input type="hidden" name="role" value="USER" />
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          Demote
                        </Button>
                      </form>
                    ) : (
                      <form action={updateUserRoleAction}>
                        <input type="hidden" name="userId" value={user.id} />
                        <input type="hidden" name="role" value="ADMIN" />
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          Make admin
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}