import { createFileRoute, Link } from "@tanstack/react-router";
import { useBoard } from "@/lib/store";
import { cr, people } from "@/lib/data";
import { PageHead, StatusPill } from "@/components/ui-bits";

export const Route = createFileRoute("/log")({
  head: () => ({
    meta: [
      { title: "Decision log- groundwork" },
      {
        name: "description",
        content: "Every scenario change in the meeting, timestamped with its resulting numbers.",
      },
      { property: "og:title", content: "Decision log- groundwork" },
      { property: "og:description", content: "A timestamped record of each scenario change." },
    ],
  }),
  component: Log,
});

function Log() {
  const { log } = useBoard();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-8 min-h-screen">
      <PageHead eyebrow="In the room" title="Decision log.">
        Every move and scenario tried on the board, newest first.
      </PageHead>

      {log.length === 0 ? (
        <p className="rounded-md border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
          Nothing yet.{" "}
          <Link to="/board" className="font-semibold text-gold-deep underline">
            Open the board
          </Link>{" "}
          and try a move.
        </p>
      ) : (
        <ol className="relative border-l border-border pl-6 space-y-6">
          {log.map((e) => (
            <li key={e.id} className="fade-slow relative pb-4">
              <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full bg-gold-deep" />
              <p className="tnum text-xs text-gold-deep">{e.time}</p>
              <p className="mt-1 font-semibold text-ink">{e.action}</p>
              <div className="tnum mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span>Property {e.result.propertyShare}%</span>
                <span>Plant {cr(e.result.cashForPlant)}</span>
                <span>Gap {cr(e.result.fairnessGap)}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {people.map((p) => (
                  <span key={p.id} className="text-xs text-ink">
                    {p.name}: <StatusPill s={e.result.status[p.id]} />
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
