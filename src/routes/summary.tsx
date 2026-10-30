import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Printer } from "lucide-react";
import { useBoard } from "@/lib/store";
import { cr, moves, people, presets, relativeTimeline, type Result } from "@/lib/data";
import { PageHead, StatusPill, useCurrentDay } from "@/components/ui-bits";
import { DecisionQueue } from "@/components/DecisionQueue";

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
  const today = useCurrentDay();
  const { on, preset, result, baseline, setup, log, rationale, setRationale } = useBoard();
  const p = presets.find((x) => x.id === preset);
  const chosen = moves.filter((m) => on.has(m.id));

  const dynamicNextSteps = useMemo(() => {
    const due = (label: string, targetDate: string) => `${label} · ${relativeTimeline(targetDate)}`;
    const list: [string, string, string][] = [
      ["Anika", "Ask broker for price extension on Worli flat", due("31 Oct", "2026-10-31")],
    ];

    if (on.has("alibaug")) {
      list.push([
        "CA",
        "Compute capital gains on Alibaug and advise Section 54 reinvestment relief",
        due("7 Nov", "2026-11-07"),
      ]);
    }

    if (on.has("bkc")) {
      list.push([
        "CA",
        "Structure commercial capital gains on BKC floor and 54EC bonds / capital gain deposit",
        due("7 Nov", "2026-11-07"),
      ]);
    }

    if (on.has("buy")) {
      list.push([
        "Lawyer",
        "Draft gift deed vs cash gift structuring for Worli flat and confirm stamp duty",
        due("14 Nov", "2026-11-14"),
      ]);
    } else if (on.has("rent")) {
      list.push([
        "Lawyer",
        "Review Worli lease agreement and tenancy protections for Arjun",
        due("14 Nov", "2026-11-14"),
      ]);
    }

    list.push([
      "Family",
      "Family sign-off before ~6 Dec (before the 13 Dec vote)",
      due("~6 Dec", "2026-12-06"),
    ]);

    return list;
  }, [on, today]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-8 min-h-screen">
      <PageHead eyebrow="Decision record" title="Meeting summary.">
        Prepared by Anika. Illustrative figures; tax and legal pending.
      </PageHead>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <button
          onClick={() => window.print()}
          className="no-print ml-auto inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-border bg-card px-4 py-2 text-sm font-semibold text-ink hover:border-gold-deep shadow-sm transition-colors"
        >
          <Printer size={16} /> Print summary
        </button>
      </div>

      <section className="mb-10">
        <p className="eyebrow text-gold-deep">Chosen scenario</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">
          {p ? `${p.id}- ${p.name}` : "Custom combination"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {chosen.length ? chosen.map((m) => m.label).join(" · ") : "No moves- status quo."}
        </p>

        {/* Rationale Textarea */}
        <label className="mt-4 block">
          <span className="eyebrow text-gold-deep block mb-1.5">Advisor Rationale & Consensus Notes</span>
          <textarea
            rows={3}
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder="Record the family's consensus rationale for the chosen scenario..."
            className="w-full rounded-md border border-border bg-card p-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </label>
      </section>

      <section className="mb-10">
        <p className="eyebrow text-gold-deep">Decision queue</p>
        <p className="mt-1 text-sm text-muted-foreground">The next decisions, owners, dates, and scenarios they affect.</p>
        <div className="mt-3">
          <DecisionQueue />
        </div>
      </section>

      {/* Scenarios tried from Log */}
      <section className="mb-10">
        <p className="eyebrow text-gold-deep">Scenarios tried in session</p>
        <p className="mt-1 text-xs text-muted-foreground">Interactive log of moves tested during the meeting.</p>
        {log.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Scenario {p ? p.id : "Custom"}</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-md border border-border bg-card">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground bg-cream/40">
                  <th className="p-2.5 font-medium">Time</th>
                  <th className="p-2.5 font-medium">Scenario / Action</th>
                  <th className="p-2.5 text-right font-medium">Property %</th>
                  <th className="p-2.5 text-right font-medium">Plant Cash</th>
                  <th className="p-2.5 text-right font-medium">Fairness Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {log.slice(0, 6).map((e) => (
                  <tr key={e.id} className="hover:bg-cream/20">
                    <td className="tnum p-2.5 text-muted-foreground whitespace-nowrap">{e.time}</td>
                    <td className="p-2.5 font-medium text-ink">{e.action}</td>
                    <td className="tnum p-2.5 text-right text-ink">{e.result.propertyShare}%</td>
                    <td className="tnum p-2.5 text-right text-ink">{cr(e.result.cashForPlant)}</td>
                    <td className="tnum p-2.5 text-right text-ink">{cr(e.result.fairnessGap)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
          {dynamicNextSteps.map(([who, what, when]) => (
            <li key={what} className="flex gap-4 border-b border-border/60 pb-3">
              <span className="w-16 shrink-0 font-semibold text-ink">{who}</span>
              <span className="flex-1 text-muted-foreground">{what}</span>
              <span className="tnum text-gold-deep font-semibold whitespace-nowrap">{when}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
