const mockEvents = [
  {
    id: 1,
    title: "Sunday Long Ride",
    date: "2025-04-13T08:00:00Z",
    location: "Jackson Creek Loop",
    type: "Training",
  },
  {
    id: 2,
    title: "Midweek Crit Practice",
    date: "2025-04-16T18:00:00Z",
    location: "Campus Circuit",
    type: "Training",
  },
  {
    id: 3,
    title: "Spring Classic",
    date: "2025-04-21T09:00:00Z",
    location: "County Roads",
    type: "Race",
  },
];

export default function EventsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
        <p className="text-sm text-slate-400">
          Upcoming team rides, races, and events. Later this will hook into a
          real calendar and allow RSVPs.
        </p>
      </header>

      <div className="space-y-2">
        {mockEvents.map((event) => (
          <article
            key={event.id}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-medium text-slate-100">{event.title}</p>
              <p className="text-xs text-slate-400">
                {new Date(event.date).toLocaleString()} • {event.location}
              </p>
            </div>
            <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-300">
              {event.type}
            </span>
          </article>
        ))}

        {mockEvents.length === 0 && (
          <p className="text-sm text-slate-400">
            No upcoming events yet. Once events are added, they&apos;ll appear
            here.
          </p>
        )}
      </div>
    </section>
  );
}