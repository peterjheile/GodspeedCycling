import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/layout/MobileNav"

// Server action for desktop logout
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
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* Header / Navbar */}
      <header className="relative z-30 border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        {/* Top accent line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />

        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo / brand */}
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-semibold tracking-tight text-slate-50 hover:text-white"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950 shadow-sm overflow-hidden">
            <img src="/icon.png" className="h-5 w-5 object-contain" />
            </span>
            <span className="flex flex-col leading-tight">
              <span>Godspeed Cycling</span>
              <span className="text-[0.7rem] font-normal uppercase tracking-[0.18em] text-slate-400">
                Team Portal
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 text-sm text-slate-300">
            <Link
              href="/"
              className="rounded-md px-2 py-1 transition hover:bg-slate-800/70 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/history"
              className="rounded-md px-2 py-1 transition hover:bg-slate-800/70 hover:text-white"
            >
              History
            </Link>
            <Link
              href="/members"
              className="rounded-md px-2 py-1 transition hover:bg-slate-800/70 hover:text-white"
            >
              Members
            </Link>
            <Link
              href="/results"
              className="rounded-md px-2 py-1 transition hover:bg-slate-800/70 hover:text-white"
            >
              Results
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md px-2 py-1 transition hover:bg-slate-800/70 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/events"
              className="rounded-md px-2 py-1 transition hover:bg-slate-800/70 hover:text-white"
            >
              Events
            </Link>
            <Link
              href="/map"
              className="rounded-md px-2 py-1 transition hover:bg-slate-800/70 hover:text-white"
            >
              Map
            </Link>
          </nav>

          {/* Right side: desktop logout + mobile nav trigger */}
          <div className="flex items-center gap-2">
            {/* Desktop logout */}
            {admin && (
              <form action={logout} className="hidden md:block">
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="border-slate-600 bg-slate-900/70 text-slate-100 hover:bg-slate-800 hover:text-white"
                >
                  Logout
                </Button>
              </form>
            )}

            {/* Mobile menu (handles its own md:hidden inside) */}
            <MobileNav admin={admin} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}