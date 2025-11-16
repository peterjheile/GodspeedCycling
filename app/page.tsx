import Link from "next/link";

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-col justify-center">
      <div className="max-w-xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Godspeed Biking
        </p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          Team rides, stats, and events in one clean dashboard.
        </h1>
        <p className="text-sm text-slate-300 md:text-base">
          Connect your rides, keep your squad in sync, and track progress over
          the season. Built for small teams who actually ride together.
        </p>

        <div className="flex gap-3 pt-2">
          <Link
            href="/dashboard"
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
          >
            Go to dashboard
          </Link>
          <button
            className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-400"
            type="button"
          >
            View roadmap
          </button>
        </div>
      </div>
    </section>
  );
}