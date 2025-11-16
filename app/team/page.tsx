const mockTeam = [
  {
    id: 1,
    name: "Alex Rider",
    role: "Captain",
    favoriteDiscipline: "Road",
    seasonMiles: 2145,
  },
  {
    id: 2,
    name: "Jordan Lee",
    role: "Climber",
    favoriteDiscipline: "Climbing",
    seasonMiles: 1730,
  },
  {
    id: 3,
    name: "Taylor Cruz",
    role: "Sprinter",
    favoriteDiscipline: "Crits",
    seasonMiles: 1320,
  },
];

export default function TeamPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
        <p className="text-sm text-slate-400">
          Profiles for Godspeed team members. Later this will sync with real
          accounts and Strava data.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {mockTeam.map((rider) => (
          <article
            key={rider.id}
            className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-slate-950">
              {rider.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-slate-100">
                {rider.name}
              </h2>
              <p className="text-xs text-emerald-300">{rider.role}</p>
              <p className="mt-1 text-xs text-slate-400">
                {rider.favoriteDiscipline} • {rider.seasonMiles} mi this season
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}