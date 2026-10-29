import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronUp } from "lucide-react";
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

function Board() {
  const { on, toggle, applyPreset, preset, result, setup } = useBoard();
  const [sheet, setSheet] = useState(false);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-40 pt-8 md:px-8 lg:pb-16 min-h-screen">
      {/* Clean Uncrowded Header with Mehta Case Pill */}
      <div className="fade-slow border-b border-border pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <p className="eyebrow text-gold-deep">Mehta family · Meeting {setup.meetingDate}</p>
          <span className="inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-cream/95 px-3 py-1 text-xs font-semibold text-walnut shadow-sm">
            <span className="h-2 w-2 rounded-full bg-burgundy" />
            Mehta Family Case · Active MVP
          </span>
        </div>
        <h1 className="mt-2 max-w-4xl text-3xl font-bold leading-tight text-ink md:text-5xl">
          Commit <Num fact={facts.worli}>₹15 Cr</Num> to the Worli flat for Arjun, or what instead?
        </h1>
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
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-ink">{p.name}</span>
                      <span className="tnum text-sm text-ink">{cr(s.value)}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>{p.note}</span>
                      <span className="text-gold-deep font-medium">{sold ? "Sell" : s.status}</span>
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

        {/* Centre Column: Scenarios, Moves, and Comps */}
        <section className="min-w-0 space-y-8">
          <div>
            <p className="eyebrow text-muted-foreground">Scenarios</p>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`shrink-0 rounded-sm border px-3 py-2 text-left text-sm transition-colors ${
                    preset === p.id
                      ? "border-espresso bg-espresso text-on-dark shadow-sm"
                      : "border-border bg-card hover:border-gold-deep text-ink"
                  }`}
                >
                  <span className={`tnum block text-xs ${preset === p.id ? "text-gold" : "opacity-70"}`}>
                    {p.id}
                  </span>
                  {p.name}
                </button>
              ))}
            </div>
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
                      className={`flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors ${
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
                        <span className="block font-semibold text-ink">{m.label}</span>
                        <span className="tnum block text-xs text-muted-foreground">{m.hint}</span>
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
                      <td className="tnum p-3 text-right font-semibold text-ink">{cr(c.ask)}</td>
                      <td className="tnum p-3 text-right text-muted-foreground">{c.psf.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          className="flex w-full items-center justify-between px-4 py-3"
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
