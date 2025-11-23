"use client"

import { useState } from "react"
import Link from "next/link"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const toggle = () => setOpen((prev) => !prev)
  const close = () => setOpen(false)

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        onClick={toggle}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-900/80 hover:bg-slate-800"
      >
        <span className="sr-only">Toggle navigation</span>
        <div className="space-y-1">
          <span className="block h-0.5 w-5 bg-slate-200" />
          <span className="block h-0.5 w-5 bg-slate-200" />
          <span className="block h-0.5 w-5 bg-slate-200" />
        </div>
      </button>

      {/* Dropdown menu */}
      {open && (
        <nav className="absolute left-0 right-0 top-[56px] z-20 border-t border-slate-800 bg-slate-900/95 px-4 pb-4 pt-3 text-sm text-slate-300 md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-2">
            <Link href="/" onClick={close} className="px-1 py-1.5 hover:text-white">
              Home
            </Link>
            <Link href="/history" onClick={close} className="px-1 py-1.5 hover:text-white">
              History
            </Link>
            <Link href="/members" onClick={close} className="px-1 py-1.5 hover:text-white">
              Members
            </Link>
            <Link href="/results" onClick={close} className="px-1 py-1.5 hover:text-white">
              Results
            </Link>
            <Link href="/dashboard" onClick={close} className="px-1 py-1.5 hover:text-white">
              Dashboard
            </Link>
            <Link href="/events" onClick={close} className="px-1 py-1.5 hover:text-white">
              Events
            </Link>
            <Link href="/map" onClick={close} className="px-1 py-1.5 hover:text-white">
              Map
            </Link>
          </div>
        </nav>
      )}
    </>
  )
}