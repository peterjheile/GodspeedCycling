import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/layout/MobileNav"

async function logout() {
  "use server"
  // NextAuth logout endpoint
  redirect("/api/auth/signout?callbackUrl=/admin/login")
}

type AppShellProps = {
  children: ReactNode
}

export async function AppShell({ children }: AppShellProps) {
  const admin = await isAdmin()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
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

          {/* Right side: logout (if admin) + mobile hamburger */}
          <div className="flex items-center gap-2">
            {admin && (
              <form action={logout}>
                <Button type="submit" variant="outline" size="sm">
                  Logout
                </Button>
              </form>
            )}

            {/* Mobile nav (hamburger + dropdown) */}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {children}
      </main>
    </div>
  )
}