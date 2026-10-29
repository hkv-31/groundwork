import { CheckCircle2, CircleAlert } from "lucide-react";
import { cr, deadlines, facts, people, type Result } from "@/lib/data";
import { CountUp, Num, StatusPill } from "./ui-bits";

export function Scoreboard({ r, compact }: { r: Result; compact?: boolean }) {
  const shareOk = Math.abs(r.propertyShare - r.targetShare) <= 5;
  const plantPct = Math.min(100, (r.cashForPlant / r.plantNeed) * 100);
  const shareDiff = Math.round((r.propertyShare - r.targetShare) * 10) / 10;
  const shareDiffLabel =
    shareDiff > 0
      ? `${shareDiff} pts above target`
      : shareDiff < 0
      ? `${Math.abs(shareDiff)} pts below target`
      : "On target";

  const isSpare = r.plantGap <= 0;
  const gapAbs = Math.abs(r.plantGap);
  const plantWord = isSpare ? `${cr(gapAbs)} spare` : `${cr(gapAbs)} short`;

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
          {r.propertyShare > 60 ? `⚠️ ${shareDiffLabel} (exceeds 60% threshold)` : shareDiffLabel}
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
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              isSpare
                ? "text-met bg-met/10 border-met/25"
                : "text-burgundy bg-burgundy/10 border-burgundy/25"
            }`}
          >
            {isSpare ? <CheckCircle2 size={13} aria-hidden /> : <CircleAlert size={13} aria-hidden />}
            {plantWord}
          </span>
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
          <p className="eyebrow text-walnut font-semibold border-b border-border pb-2">Key Deadlines & Timeline</p>
          <ul className="mt-3 space-y-3">
            {deadlines.map((d) => (
              <li key={d.key} className="flex items-start justify-between gap-3 text-xs sm:text-sm">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium text-ink leading-snug">{d.label}</p>
                    {d.flagged && (
                      <span className="rounded bg-burgundy/10 px-1.5 py-0.5 text-[10px] font-bold text-burgundy border border-burgundy/25">
                        Flagged
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="tnum font-semibold text-gold-deep block">{d.date}</span>
                  <span className="tnum text-[11px] text-muted-foreground block">{d.timeRemaining}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
