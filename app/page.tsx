import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <section
      className="
        relative
        left-1/2 right-1/2
        ml-[-50vw] mr-[-50vw]
        w-screen
        flex min-h-[calc(100vh-4rem)]
        items-end justify-start
        overflow-hidden
        -mt-6 -mb-6
      "
    >
      {/* Background image */}
      <Image
        src="/team-hero2.png"
        alt="Godspeed Cycling Team"
        fill
        priority
        className="object-cover brightness-[0.70]" 
      />

      {/* Subtle bottom fade for readable text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

      {/* Info block */}
      <div className="relative z-10 max-w-lg space-y-4 p-8 md:p-12 lg:p-16 text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
          Godspeed Biking
        </p>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug text-white">
          Team rides, stats, and events.
        </h1>

        <p className="text-sm md:text-base text-slate-200">
          Keep your squad in sync and track progress over the season.
        </p>

        <div className="flex gap-3 pt-2">
          <Link
            href="/dashboard"
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
          >
            Dashboard
          </Link>

          <button
            type="button"
            className="rounded-md border border-slate-300/40 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-200"
          >
            Roadmap
          </button>
        </div>
      </div>
    </section>
  )
}