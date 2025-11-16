const mockStats = [
  { label: "This week", value: "87 mi" },
  { label: "This month", value: "342 mi" },
  { label: "Season total", value: "2,145 mi" },
  { label: "Team rides", value: "18" },
];

const mockRides = [
  {
    id: 1,
    name: "Tuesday Night Tempo",
    distance: "24.3 mi",
    duration: "1h 18m",
    date: "2025-04-08",
  },
  {
    id: 2,
    name: "Sunday Long Ride",
    distance: "62.1 mi",
    duration: "3h 47m",
    date: "2025-04-06",
  },
  {
    id: 3,
    name: "Recovery Spin",
    distance: "13.5 mi",
    duration: "0h 42m",
    date: "2025-04-04",
  },
];

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-400">
          Overview of your recent riding and team activity.
        </p>
      </header>

      {/* Top stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
          >
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-400">
              {stat.label}
            </p>
            <p className="mt-2 text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent rides list */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-100">
              Recent rides
            </h2>
            <button
              type="button"
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              View all
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {mockRides.map((ride) => (
              <div
                key={ride.id}
                className="flex items-center justify-between rounded-md bg-slate-900/80 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-100">{ride.name}</p>
                  <p className="text-xs text-slate-400">
                    {ride.distance} • {ride.duration}
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(ride.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
          <h2 className="text-sm font-medium text-slate-100">
            Next up for Godspeed
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            This panel will later show upcoming team events and suggested rides
            based on your recent activity.
          </p>
        </div>
      </div>
    </section>
  );
}