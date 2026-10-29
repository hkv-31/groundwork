import { cr, deadlines, facts, people, type Result } from "@/lib/data";
import { CountUp, Num, StatusPill } from "./ui-bits";

export function Scoreboard({ r, compact }: { r: Result; compact?: boolean }) {
  const shareOk = Math.abs(r.propertyShare - r.targetShare) <= 5;
  const plantPct = Math.min(100, (r.cashForPlant / r.plantNeed) * 100);

  return (
    <div className="space-y-6">
      {/* Property Concentration */}
      <div className="rounded-lg border border-border bg-card p-4 transition-all">
        <div className="flex items-baseline justify-between text-xs text-muted-foreground">
          <span className="eyebrow text-walnut font-semibold">Property Concentration</span>
          <span className="font-medium text-ink">Target {r.targetShare}%</span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-display text-3xl font-bold tracking-tight text-ink">
            <Num fact={facts.propertyShare}>
              <CountUp value={r.propertyShare} format={(n) => `${Math.round(n)}%`} />
            </Num>
          </span>
          <StatusPill s={shareOk ? "Met" : Math.abs(r.propertyShare - r.targetShare) <= 10 ? "Partly" : "Not met"} />
        </div>
        <div className="relative mt-2.5 h-2 w-full overflow-hidden rounded-full bg-cream">
          <div
            className="h-full rounded-full bg-indigo transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, r.propertyShare)}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gold-deep"
            style={{ left: `${r.targetShare}%` }}
            title={`Benchmark target: ${r.targetShare}%`}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {r.propertyShare > 60
            ? "⚠️ Exceeds 60% wealth concentration threshold"
            : "Balanced portfolio allocation"}
        </p>
      </div>

      {/* Cash for Plant Capex */}
      <div className="rounded-lg border border-border bg-card p-4 transition-all">
        <div className="flex items-baseline justify-between text-xs text-muted-foreground">
          <span className="eyebrow text-walnut font-semibold">Plant Capex Liquidity</span>
          <span>
            Need <Num fact={facts.plant}>{cr(r.plantNeed)}</Num>
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-display text-3xl font-bold tracking-tight text-ink">
            <Num fact={facts.cashForPlant}>
              <CountUp value={r.cashForPlant} format={(n) => cr(Math.round(n * 10) / 10)} />
            </Num>
          </span>
          <StatusPill s={r.deadlines["plant"] ?? "Partly"} />
        </div>
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-cream">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              plantPct >= 100 ? "bg-met" : plantPct >= 75 ? "bg-gold" : "bg-burgundy"
            }`}
            style={{ width: `${plantPct}%` }}
          />
        </div>
        {r.debt > 0 && (
          <p className="mt-2 text-[11px] text-muted-foreground flex items-center justify-between border-t border-border/60 pt-1.5">
            <span>Bridge Debt Component</span>
            <span className="font-semibold text-burgundy">
              <Num fact={facts.debt}>{cr(r.debt)}</Num>
            </span>
          </p>
        )}
      </div>

      {/* Family Stakeholder Alignment */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="eyebrow text-walnut font-semibold">Stakeholder Mandates</span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">4 Key Wishes</span>
        </div>
        <ul className="mt-2 divide-y divide-border/60">
          {people.map((p) => (
            <li key={p.id} className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
              <span className="font-medium text-ink">
                {p.name} <span className="text-muted-foreground font-normal">· {p.wish}</span>
              </span>
              <StatusPill s={r.status[p.id]} />
            </li>
          ))}
        </ul>
      </div>

      {/* Fairness Gap Metric */}
      <div className="rounded-lg border border-border bg-card p-4 flex items-baseline justify-between">
        <div>
          <span className="eyebrow text-walnut font-semibold block">Sibling Fairness Gap</span>
          <span className="text-[11px] text-muted-foreground">Arjun vs Riya allocation</span>
        </div>
        <span className="font-display text-2xl font-bold tracking-tight text-ink">
          <Num fact={facts.fairness}>
            <CountUp value={r.fairnessGap} format={(n) => cr(Math.round(n * 10) / 10)} />
          </Num>
        </span>
      </div>

      {/* Deadlines */}
      {!compact && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="eyebrow text-walnut font-semibold border-b border-border pb-2">Irrevocable Deadlines</p>
          <ul className="mt-3 space-y-3">
            {deadlines.map((d) => (
              <li key={d.key} className="flex items-start justify-between gap-3 text-xs sm:text-sm">
                <div>
                  <span className="tnum font-semibold text-gold-deep">{d.date}</span>
                  <p className="text-muted-foreground text-[11px] leading-snug">{d.label}</p>
                </div>
                <StatusPill s={r.deadlines[d.key] ?? "Partly"} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
