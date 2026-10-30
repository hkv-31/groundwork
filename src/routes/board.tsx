import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Check, ChevronUp, RotateCcw } from "lucide-react";
import { useBoard } from "@/lib/store";
import { cr, facts, moves, people, presets, properties, worliComps } from "@/lib/data";
import { Num, StatusPill, TagChip } from "@/components/ui-bits";
import { Scoreboard } from "@/components/Scoreboard";

export const Route = createFileRoute("/board")({
  head: () => ({
    meta: [
      { title: "The Board- groundwork" },
      {
        name: "description",
        content: "Live decision board: moves, scenarios and a scoreboard for the Mehta family meeting.",
      },
      { property: "og:title", content: "The Board- groundwork" },
      {
        property: "og:description",
        content: "Commit ₹15 Cr to the Worli flat for Arjun, or what instead?",
      },
    ],
  }),
  component: Board,
});

interface InsightData {
  title: string;
  source: string;
  calc: string;
  tag: "Assumed" | "Sourced";
}

const insightsData: InsightData[] = [
  {
    title: "Alibaug ≈ ₹15 lakh per weekend",
    source: "Family usage pattern & holding cost",
    calc: "The family uses the villa only four weekends a year. Keeping ₹8 Cr tied up there works out to roughly ₹15 lakh for each weekend used.",
    tag: "Assumed",
  },
  {
    title: "Property earns ≈ 3.7% gross",
    source: "Cushman & Wakefield & market rental yields",
    calc: "The ₹120 Cr property portfolio earns roughly 3.7% before costs. BKC contributes ₹4.02 Cr a year and Worli contributes about ₹0.4 Cr.",
    tag: "Sourced",
  },
  {
    title: "Matching Riya turns a ₹6 Cr gap into ₹13.85 Cr",
    source: "Sibling transfer and equalisation model",
    calc: "If the family buys the flat for Arjun, matching that transfer for Riya also uses cash. The plant gap grows from about ₹6 Cr in P1 to ₹13.85 Cr in P3.",
    tag: "Assumed",
  },
];

function InsightPopover({ item, align = "left" }: { item: InsightData; align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-medium text-ink hover:border-gold-deep transition-colors shadow-xs"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-gold-deep" />
        {item.title}
      </button>
      {open && (
        <div
          role="dialog"
          className={`fade-slow absolute bottom-full z-50 mb-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-line-dark bg-espresso p-4 text-left text-xs text-on-dark shadow-2xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="mb-2 flex items-center justify-between border-b border-line-dark pb-1.5">
            <span className="eyebrow text-gold">Insight Evidence</span>
            <TagChip t={item.tag} />
          </div>
          <p className="font-semibold text-on-dark text-sm">{item.title}</p>
          <p className="mt-2 text-on-dark-muted text-xs leading-relaxed">{item.calc}</p>
          <p className="mt-2 text-[11px] text-champagne/80 border-t border-line-dark pt-1.5">
            Source: {item.source}
          </p>
        </div>
      )}
    </div>
  );
}

function Board() {
  const { on, toggle, applyPreset, preset, result, setup, setSetup, reset } = useBoard();
  const [sheet, setSheet] = useState(false);
  const selectedPreset = presets.find((p) => p.id === preset);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-40 pt-8 md:px-8 lg:pb-16 min-h-screen">
      {/* Clean Uncrowded Header with Mehta Case Pill */}
      <div className="fade-slow border-b border-border pb-6">
        <div className="flex flex-wrap items-center justify-end gap-2 mb-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-cream/95 px-3 py-1 text-xs font-semibold text-walnut shadow-sm">
            <span className="h-2 w-2 rounded-full bg-burgundy" />
            Mehta Family Case · Active MVP
          </span>
        </div>
        <h1 className="mt-2 max-w-4xl text-3xl font-bold leading-tight text-ink md:text-5xl">
          Commit <Num fact={facts.worli}>₹15 Cr</Num> to the Worli flat for Arjun, or what instead?
        </h1>
        {/* Insights Strip */}
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <span className="eyebrow text-gold-deep text-[11px] mr-1">Key Insights:</span>
          {insightsData.map((item, index) => (
            <InsightPopover
              key={item.title}
              item={item}
              align={index === insightsData.length - 1 ? "right" : "left"}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr_320px]">
        {/* Left Column: Properties & People */}
        <aside className="space-y-8">
          <section>
            <p className="eyebrow text-muted-foreground">Property · <Num fact={facts.property}>₹120 Cr</Num></p>
            <ul className="mt-3 space-y-2">
              {properties.map((p) => {
                const s = setup.props.find((x) => x.id === p.id) || p;
                const sold = (p.id === "alibaug" && on.has("alibaug")) || (p.id === "bkc" && on.has("bkc"));
                return (
                  <li
                    key={p.id}
                    className={`rounded-md border border-border bg-card p-3 transition-opacity duration-300 ${
                      sold ? "opacity-50" : ""
                    }`}
                  >
                    <div className="grid grid-cols-[minmax(0,1fr)_64px] gap-x-3">
                      <span className="text-[13px] font-semibold text-ink">{p.name}</span>
                      <span className="tnum text-right text-[13px] text-ink">{cr(s.value)}</span>
                      <span className="mt-1 min-w-0 text-[11px] text-muted-foreground">{p.note}</span>
                      <span className="mt-1 text-right text-[11px] font-medium text-gold-deep">
                        {sold ? "Sell" : s.status}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <p className="eyebrow text-muted-foreground">People</p>
            <ul className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
              {people.map((p) => (
                <li key={p.id} className="rounded-md border border-border bg-card p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{p.name}</span>
                    <StatusPill s={result.status[p.id]} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{setup.priorities[p.id]}</p>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* Centre Column: Scenarios, Reserve Slider, Moves, and Comps */}
        <section className="min-w-0 space-y-8">
          {/* Liquid Reserve Slider Card with Break-Even Marker */}
          <div className="rounded-md border border-border bg-card p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="eyebrow text-muted-foreground">Liquid Reserve Slider</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Break-even reserve is ₹23.95 Cr (funds flat + plant without asset sales)
                </p>
              </div>
              <span className="tnum font-display text-xl font-bold text-ink">
                ₹{setup.reserve.toFixed(1)} Cr
              </span>
            </div>

            <div className="relative mt-5 mb-2">
              <input
                type="range"
                min="15"
                max="40"
                step="0.5"
                value={setup.reserve}
                onChange={(e) => setSetup({ ...setup, reserve: Number(e.target.value) })}
                className="w-full h-2 rounded-lg cursor-pointer bg-cream border border-border accent-gold"
                aria-label="Liquid reserve slider"
              />
              {/* Marker at ₹23.95 Cr: ((23.95 - 15) / (40 - 15)) * 100 = 35.8% */}
              <div
                className="absolute -top-1 pointer-events-none flex flex-col items-center"
                style={{ left: `${((23.95 - 15) / 25) * 100}%`, transform: "translateX(-50%)" }}
              >
                <div className="w-0.5 h-4 bg-burgundy" />
                <span className="text-[10px] font-semibold text-burgundy whitespace-nowrap bg-cream/95 px-1 py-0.5 rounded border border-burgundy/25 mt-1">
                  ₹23.95 Cr break-even
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-between text-[11px] text-muted-foreground">
              <span>Min ₹15 Cr</span>
              <span>Break-even ₹23.95 Cr</span>
              <span>Target ₹30 Cr</span>
              <span>Max ₹40 Cr</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="eyebrow text-muted-foreground">Scenarios</p>
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-sm border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-ink hover:border-gold-deep transition-colors"
                title="Reset to P1 default scenario"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`shrink-0 min-h-[44px] rounded-sm border px-3 py-2 text-left text-sm transition-colors ${
                    preset === p.id
                      ? "border-espresso bg-espresso text-on-dark shadow-sm"
                      : "border-border bg-card hover:border-gold-deep text-ink"
                  }`}
                >
                    <span className={`tnum block text-sm font-semibold ${preset === p.id ? "text-gold" : "opacity-70"}`}>
                      {p.id}
                    </span>
                </button>
              ))}
            </div>
            <p className="mt-2 min-h-5 text-sm text-muted-foreground">
              {selectedPreset?.desc ?? "Custom combination- adjust the moves below."}
            </p>
          </div>

          <div>
            <p className="eyebrow text-muted-foreground">Moves</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {moves.map((m) => {
                const active = on.has(m.id);
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => toggle(m.id)}
                      aria-pressed={active}
                      className={`flex min-h-[44px] w-full items-center gap-3 rounded-md border p-4 text-left transition-colors ${
                        active ? "border-gold-deep bg-cream" : "border-border bg-card hover:border-gold-deep"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border ${
                          active ? "border-espresso bg-espresso text-gold" : "border-border bg-card"
                        }`}
                      >
                        {active && <Check size={13} />}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-ink">{m.label}</span>
                        <span className="tnum block text-[11px] text-muted-foreground">{m.hint}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p className="eyebrow text-muted-foreground">Worli comps</p>
              <TagChip t="Sourced" />
              <span className="text-xs italic text-muted-foreground">asking listing</span>
            </div>
            <div className="mt-3 overflow-x-auto rounded-md border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground bg-cream/40">
                    <th className="p-3 font-medium">Listing</th>
                    <th className="p-3 text-right font-medium">Asking</th>
                    <th className="p-3 text-right font-medium">₹/sq ft</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {worliComps.map((c) => (
                    <tr key={c.bldg} className="border-b border-border/60 last:border-0 hover:bg-cream/20">
                      <td className="p-3 text-ink">{c.bldg}</td>
                      <td className="tnum p-3 text-right font-semibold text-ink">
                        {c.ask != null ? cr(c.ask) : "Not listed"}
                      </td>
                      <td className="tnum p-3 text-right text-muted-foreground">{c.psf.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs italic text-muted-foreground">
              Target flat area/floor: Missing
            </p>
          </div>
        </section>

        {/* Right Column: Desktop Scoreboard */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-md border border-border bg-card p-5 shadow-sm">
            <p className="eyebrow mb-4 text-gold-deep">Scoreboard</p>
            <Scoreboard r={result} />
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Sheet Scoreboard */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card shadow-[0_-8px_24px_-12px_rgba(79,5,26,0.15)] lg:hidden">
        <button
          onClick={() => setSheet(!sheet)}
          className="flex min-h-[44px] w-full items-center justify-between px-4 py-3"
          aria-expanded={sheet}
        >
          <span className="eyebrow text-gold-deep">Scoreboard</span>
          <span className="tnum flex items-center gap-3 text-sm text-ink font-semibold">
            <span>{result.propertyShare}% prop</span>
            <span>{cr(result.cashForPlant)} plant</span>
            <ChevronUp size={18} className={`transition-transform text-muted-foreground ${sheet ? "rotate-180" : ""}`} />
          </span>
        </button>
        {sheet && (
          <div className="max-h-[65vh] overflow-y-auto border-t border-border px-4 py-4">
            <Scoreboard r={result} />
          </div>
        )}
      </div>
    </main>
  );
}
