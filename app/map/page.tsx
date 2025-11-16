export default function MapPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Map</h1>
        <p className="text-sm text-slate-400">
          An interactive view of team rides. Team members will be able to opt in
          to share their Strava routes here.
        </p>
      </header>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between text-sm">
          <p className="text-slate-200">Team ride heatmap</p>
          <p className="text-xs text-slate-500">
            Map integration coming soon — routes will appear here.
          </p>
        </div>

        <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/60 text-xs text-slate-500">
          Interactive map placeholder
        </div>
      </div>
    </section>
  );
}