import { createFileRoute } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { useBoard } from "@/lib/store";
import { cr, moves, people, presets, type Result } from "@/lib/data";
import { PageHead, StatusPill } from "@/components/ui-bits";

export const Route = createFileRoute("/summary")({
  head: () => ({
    meta: [
      { title: "Meeting summary- groundwork" },
      {
        name: "description",
        content: "Printable recap of the chosen scenario, before and after, and next steps.",
      },
      { property: "og:title", content: "Meeting summary- groundwork" },
      {
        property: "og:description",
        content: "The chosen scenario, before and after, and next steps.",
      },
    ],
  }),
  component: Summary,
});

const rows: [string, (r: Result) => string][] = [
  ["Property share", (r) => `${r.propertyShare}%`],
  ["Cash for plant", (r) => cr(r.cashForPlant)],
  ["Debt", (r) => cr(r.debt)],
  ["Fairness gap", (r) => cr(r.fairnessGap)],
];

function Summary() {
  const { on, preset, result, baseline, setup } = useBoard();
  const p = presets.find((x) => x.id === preset);
  const chosen = moves.filter((m) => on.has(m.id));

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-8 min-h-screen">
      <PageHead eyebrow={`Mehta family · ${setup.meetingDate}`} title="Meeting summary.">
        Prepared by Anika. Illustrative figures; tax and legal pending.
      </PageHead>

      <button
        onClick={() => window.print()}
        className="no-print mb-8 inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2 text-sm font-semibold text-ink hover:border-gold-deep shadow-sm transition-colors"
      >
        <Printer size={16} /> Print
      </button>

      <section className="mb-10">
        <p className="eyebrow text-gold-deep">Chosen scenario</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">
          {p ? `${p.id} — ${p.name}` : "Custom combination"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {chosen.length ? chosen.map((m) => m.label).join(" · ") : "No moves — status quo."}
        </p>
      </section>

      <section className="mb-10">
        <p className="eyebrow text-gold-deep">Before / after</p>
        <table className="mt-3 w-full border-y border-border text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground bg-cream/40">
              <th className="py-2.5 px-3 font-medium">Measure</th>
              <th className="py-2.5 px-3 text-right font-medium">Before</th>
              <th className="py-2.5 px-3 text-right font-medium">After</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map(([l, f]) => (
              <tr key={l} className="border-b border-border/60 last:border-0 hover:bg-cream/20">
                <td className="py-2.5 px-3 text-ink">{l}</td>
                <td className="tnum py-2.5 px-3 text-right text-muted-foreground">{f(baseline)}</td>
                <td className="tnum py-2.5 px-3 text-right font-semibold text-ink">{f(result)}</td>
              </tr>
            ))}
            {people.map((pp) => (
              <tr key={pp.id} className="border-b border-border/60 last:border-0 hover:bg-cream/20">
                <td className="py-2.5 px-3 text-ink font-medium">
                  {pp.name} · {pp.wish}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <StatusPill s={baseline.status[pp.id]} />
                </td>
                <td className="py-2.5 px-3 text-right">
                  <StatusPill s={result.status[pp.id]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <p className="eyebrow text-gold-deep">Next steps</p>
        <ol className="mt-3 space-y-3 text-sm">
          {[
            ["CA", "Confirm capital gains on any sale and gift-tax treatment", "20 Nov"],
            ["Lawyer", "Draft gift deed / family settlement terms", "27 Nov"],
            ["Anika", "Negotiate Worli asking price; get transacted comps", "1 Dec"],
            ["Family", "Reconvene to sign off before Worli offer expires", "10 Dec"],
          ].map(([who, what, when]) => (
            <li key={what} className="flex gap-4 border-b border-border/60 pb-3">
              <span className="w-16 shrink-0 font-semibold text-ink">{who}</span>
              <span className="flex-1 text-muted-foreground">{what}</span>
              <span className="tnum text-gold-deep font-semibold">{when}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
