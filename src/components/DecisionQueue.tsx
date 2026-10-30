import { decisionQueue, relativeTimeline } from "@/lib/data";
import { useCurrentDay } from "./ui-bits";

export function DecisionQueue() {
  useCurrentDay();
  return (
    <div className="divide-y divide-border/60 rounded-md border border-border bg-card">
      {decisionQueue.map((item, index) => (
        <div key={item.id} className="p-4">
          <div className="flex gap-3 sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <span className="tnum pt-0.5 text-sm font-semibold text-gold-deep">{index + 1}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{item.label}</p>
                {item.badge && (
                  <span className="mt-1 inline-flex rounded border border-gold/40 bg-gold/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-deep">
                    {item.badge}
                  </span>
                )}
                <p className="mt-1 text-sm text-muted-foreground">Who decides: {item.owner}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Affects{" "}
                  {item.scenarios.map((scenario, scenarioIndex) => (
                    <span key={scenario}>
                      <a
                        href={`/board#scenario-${scenario}`}
                        className="font-semibold text-gold-deep underline-offset-2 hover:underline"
                      >
                        {scenario}
                      </a>
                      {scenarioIndex < item.scenarios.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <span className="tnum shrink-0 text-right text-sm font-semibold text-gold-deep">
              <span className="block">{item.date}</span>
              {item.targetDate && (
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  {relativeTimeline(item.targetDate)}
                </span>
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
