"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Route } from "next"
import { usePathname } from "next/navigation"

type MobileNavProps = {
  admin: boolean
}

export function MobileNav({ admin }: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links :{ href: Route; label: string }[] = [
    { href: "/", label: "Home" },
    { href: "/history", label: "History" },
    { href: "/members", label: "Members" },
    { href: "/results", label: "Results" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/events", label: "Events" },
    { href: "/map", label: "Map" },
  ]

  const close = () => setOpen(false)

  return (
    <div className="flex items-center gap-2 md:hidden z-50">
      {/* Mobile logout next to menu button */}
      {admin && (
        <form action="/api/auth/signout?callbackUrl=/admin/login" method="post">
          <Button size="sm" variant="outline">
            Logout
          </Button>
        </form>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="border-slate-700 bg-slate-900">
            <span className="sr-only">Open navigation</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
            >
              <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-64 bg-slate-950 text-slate-50 border-slate-800"
          aria-describedby={undefined}
        >
          <SheetHeader className="text-left">
            <SheetTitle className="text-base font-semibold tracking-tight">
              Godspeed Cycling
            </SheetTitle>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Team Portal
            </p>
          </SheetHeader>

          

          <div className="mt-6 flex flex-col gap-3">
            {links.map(link => {

            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href))

              return (
              <Link
                key={link.href}
                href={link.href}
                passHref={true}
                onClick={close}
                className={`
                  rounded-r-md px-2 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white
                  ${isActive? "border-l-2 border-green-400 rounded-none py-1" : ""}
                  `}
                >
                
              
                <span onClick={close}>{link.label}</span>
              </Link>)
            })}
          </div>

          {admin && (
            <div className="mt-8 border-t border-slate-800 pt-4 text-xs text-slate-400">
              Logged in as admin
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}