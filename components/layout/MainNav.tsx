"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Route } from "next"

const links: {href: Route; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/history", label: "History" },
  { href: "/members", label: "Members" },
  { href: "/results", label: "Results" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/events", label: "Events" },
  { href: "/map", label: "Map" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-5 text-sm text-slate-300">
      {links.map(link => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href))


        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              px-2 pb-1 transition border-b-2
              ${isActive
                ? "border-green-400 text-white"
                : "border-transparent text-slate-300 hover:text-white hover:border-slate-600"
              }
            `}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}