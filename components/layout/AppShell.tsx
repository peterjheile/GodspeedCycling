import type { ReactNode } from "react"
import Link from "next/link"
import { isAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

// Server action for logout
async function logout() {
  "use server"
  redirect("/api/auth/signout?callbackUrl=/admin/login")
}

type AppShellProps = {
  children: ReactNode
}

export async function AppShell({ children }: AppShellProps) {
  const admin = await isAdmin()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4">
          {/* Checkbox for mobile nav toggle */}
          <input id="nav-toggle" type="checkbox" className="peer hidden" />

          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Godspeed
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-6 text-sm text-slate-300">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/history" className="hover:text-white">History</Link>
              <Link href="/members" className="hover:text-white">Members</Link>
              <Link href="/results" className="hover:text-white">Results</Link>
              <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
              <Link href="/events" className="hover:text-white">Events</Link>
              <Link href="/map" className="hover:text-white">Map</Link>
            </nav>

            {/* Desktop: admin-only logout */}
            <div className="hidden md:flex items-center gap-2">
              {admin && (
                <form action={logout}>
                  <Button type="submit" variant="outline" size="sm">
                    Logout
                  </Button>
                </form>
              )}
            </div>

            {/* Mobile: hamburger + optional logout */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Mobile logout (admin only) */}
              {admin && (
                <form action={logout}>
                  <Button type="submit" variant="outline" size="sm">
                    Logout
                  </Button>
                </form>
              )}

              {/* Hamburger button */}
              <label
                htmlFor="nav-toggle"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-900/80 hover:bg-slate-800"
              >
                <span className="sr-only">Toggle navigation</span>
                <div className="space-y-1">
                  <span className="block h-0.5 w-5 bg-slate-200" />
                  <span className="block h-0.5 w-5 bg-slate-200" />
                  <span className="block h-0.5 w-5 bg-slate-200" />
                </div>
              </label>
            </div>
          </div>

          {/* Mobile navigation panel */}
          <div className="peer-checked:block hidden md:hidden pb-3 border-t border-slate-800">
            <nav className="flex flex-col gap-2 pt-3 text-sm text-slate-300">
              <Link href="/" className="px-1 py-1.5 hover:text-white">Home</Link>
              <Link href="/history" className="px-1 py-1.5 hover:text-white">History</Link>
              <Link href="/members" className="px-1 py-1.5 hover:text-white">Members</Link>
              <Link href="/results" className="px-1 py-1.5 hover:text-white">Results</Link>
              <Link href="/dashboard" className="px-1 py-1.5 hover:text-white">Dashboard</Link>
              <Link href="/events" className="px-1 py-1.5 hover:text-white">Events</Link>
              <Link href="/map" className="px-1 py-1.5 hover:text-white">Map</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {children}
      </main>
    </div>
  )
}