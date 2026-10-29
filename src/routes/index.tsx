import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import dusk from "@/assets/mumbai-dusk.jpg";
import { compute, defaultSetup, deadlines, people, presets, cr, type MoveId } from "@/lib/data";
import { CountUp, StatusPill } from "@/components/ui-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "groundwork- Four wishes. One table." },
      {
        name: "description",
        content: "A luxury decision board for advisors running family property meetings. Decisions, built on clarity.",
      },
      { property: "og:title", content: "groundwork" },
      { property: "og:description", content: "Decisions, built on clarity. A live board for family property meetings." },
    ],
  }),
  component: Landing,
});

const steps = [
  ["Set the table", "Record each person's priority, every property's status, and the cash that must stay put."],
  ["Ask one question", "Frame the meeting around a single decision, not a portfolio review."],
  ["Move, and watch", "Toggle moves. The scoreboard shows who is met, partly met, or not."],
  ["Leave with a page", "Print the chosen scenario, the trade-offs, and who does what next."],
];

function Teaser() {
  const cycle = ["P1", "P2", "P4", "P6"];
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % cycle.length), 2600);
    return () => clearInterval(t);
  }, []);

  const p = presets.find((x) => x.id === cycle[i])!;
  const r = compute(new Set<MoveId>(p.moves), defaultSetup);

  return (
    <div className="rounded-md border border-line-dark bg-roast p-5 md:p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <span className="eyebrow text-gold">Live scoreboard</span>
        <span key={p.id} className="fade-slow text-xs text-on-dark-muted">
          {p.id} · {p.name}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4 border-b border-line-dark pb-5">
        <div>
          <p className="text-xs text-on-dark-muted">Property</p>
          <p className="font-display text-2xl font-bold md:text-3xl text-on-dark">
            <CountUp value={r.propertyShare} format={(n) => `${Math.round(n)}%`} />
          </p>
        </div>
        <div>
          <p className="text-xs text-on-dark-muted">Plant cash</p>
          <p className="font-display text-2xl font-bold md:text-3xl text-on-dark">
            <CountUp value={r.cashForPlant} format={(n) => cr(Math.round(n))} />
          </p>
        </div>
        <div>
          <p className="text-xs text-on-dark-muted">Gap</p>
          <p className="font-display text-2xl font-bold md:text-3xl text-on-dark">
            <CountUp value={r.fairnessGap} format={(n) => cr(Math.round(n))} />
          </p>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3">
        {people.map((pp) => (
          <li
            key={pp.id}
            className="flex items-center justify-between rounded-sm bg-cream px-3 py-2 text-sm text-ink shadow-sm"
          >
            <span>{pp.name.replace("Mr. ", "Mr ").replace("Mrs. ", "Mrs ")}</span>
            <StatusPill s={r.status[pp.id]} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Landing() {
  return (
    <main className="bg-espresso text-on-dark">
      {/* Hero Section in Deep Burgundy */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.3fr_1fr] md:items-end md:px-8 md:py-28">
        <div className="fade-slow">
          <p className="eyebrow text-gold">Decisions, built on clarity.</p>
          <h1 className="headline-xl mt-6">
            Four wishes.<br />
            One table.
          </h1>
          <p className="mt-6 max-w-md text-lg text-on-dark-muted leading-relaxed">
            The Mehta family holds ₹200 Cr — ₹120 Cr of it in property. Anika has one meeting to find the move everyone can live with.
          </p>
          <Link
            to="/board"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-gold px-6 py-3.5 font-semibold text-espresso transition-opacity hover:opacity-90 shadow-lg"
          >
            Open the board <ArrowRight size={18} />
          </Link>
        </div>
        <Teaser />
      </section>

      {/* At the table section — grid-style matching Four Steps */}
      <section className="bg-cream py-16 text-ink md:py-24 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="eyebrow text-gold-deep">At the table · Mehta Family Case</p>
          <h2 className="mt-3 text-4xl font-bold md:text-6xl">Everyone wants something different.</h2>
          <ol className="mt-12 grid gap-px bg-border md:grid-cols-4 rounded-md overflow-hidden border border-border">
            {people.map((p, i) => (
              <li key={p.id} className="bg-cream p-6 md:pr-8">
                <p className="tnum font-display text-5xl font-bold text-gold-deep">0{i + 1}</p>
                <h3 className="mt-6 text-xl font-bold text-ink">{p.wish}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.name} · {p.role}</p>
                <p className="mt-4 text-sm text-ink italic leading-relaxed border-t border-border pt-4">
                  "{p.line}"
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Deadlines Section */}
      <section className="relative isolate overflow-hidden">
        <img
          src={dusk}
          alt="Mumbai skyline at dusk over Marine Drive"
          width={1920}
          height={1088}
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-espresso/80" />
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
          <p className="eyebrow text-gold">Three dates. No extensions.</p>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {deadlines.map((d) => (
              <li key={d.key} className="border-t border-gold pt-5">
                <p className="tnum font-display text-3xl font-bold md:text-4xl text-on-dark">{d.date}</p>
                <p className="mt-2 text-on-dark-muted">{d.label}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* How it works Section */}
      <section className="bg-cream py-16 text-ink md:py-24 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="eyebrow text-gold-deep">How it works</p>
          <h2 className="mt-3 text-4xl font-bold md:text-6xl">Four steps to a decision.</h2>
          <ol className="mt-12 grid gap-px bg-border md:grid-cols-4 rounded-md overflow-hidden border border-border">
            {steps.map(([t, d], i) => (
              <li key={t} className="bg-cream p-6 md:pr-8">
                <p className="tnum font-display text-5xl font-bold text-gold-deep">{i + 1}</p>
                <h3 className="mt-6 text-xl font-bold text-ink">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Original Clean Footer in Deep Burgundy with Mock data removed */}
      <footer className="bg-espresso">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <p className="headline-xl">
            ground<span className="text-gold">work</span>
          </p>
          <div className="mt-10 flex flex-col justify-between gap-4 border-t border-line-dark pt-6 text-sm text-on-dark-muted md:flex-row">
            <span>Decisions, built on clarity.</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
