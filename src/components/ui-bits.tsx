import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, CircleAlert, CircleX, Menu, X } from "lucide-react";
import type { Fact, Status, Tag } from "@/lib/data";


const nav = [
  { to: "/setup", label: "Setup" },
  { to: "/board", label: "Board" },
  { to: "/log", label: "Log" },
  { to: "/summary", label: "Summary" },
  { to: "/how", label: "How" },
  { to: "/sources", label: "Sources" },
] as const;

export function TopBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 bg-espresso text-on-dark border-b border-line-dark">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        
        {/* Logo only */}
        <div className="flex items-center gap-4">
          <Link to="/" className="font-display text-xl font-bold tracking-tight text-on-dark">
            ground<span className="text-gold">work</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden gap-7 md:flex items-center">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative py-4 min-h-[44px] inline-flex items-center text-sm font-medium text-on-dark-muted transition-colors hover:text-on-dark"
              activeProps={{ className: "!text-on-dark !font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu trigger */}
        <button
          className="md:hidden text-champagne hover:text-on-dark min-h-[44px] min-w-[44px] flex items-center justify-center p-1"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="flex flex-col border-t border-line-dark bg-espresso px-4 pb-4 pt-2 md:hidden space-y-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 min-h-[44px] flex items-center text-sm text-on-dark-muted hover:bg-roast hover:text-on-dark transition-colors"
              activeProps={{ className: "!bg-roast !text-gold !font-bold" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function useCountUp(target: number, ms = 300) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(target);
      from.current = target;
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setV(a + (target - a) * p);
      if (p < 1) raf = requestAnimationFrame(step);
      else from.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      from.current = target;
    };
  }, [target, ms]);
  return v;
}

export function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const v = useCountUp(value);
  return <span className="tnum">{format(v)}</span>;
}

export function useCurrentDay() {
  const [day, setDay] = useState(() => new Date().toDateString());

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextDay = new Date().toDateString();
      setDay((currentDay) => (currentDay === nextDay ? currentDay : nextDay));
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  return day;
}

const statusMap: Record<Status, { Icon: typeof CheckCircle2; cls: string; bg: string }> = {
  Met: {
    Icon: CheckCircle2,
    cls: "text-met",
    bg: "bg-met/10 border-met/25",
  },
  Partly: {
    Icon: CircleAlert,
    cls: "text-partly",
    bg: "bg-gold/10 border-gold/30",
  },
  "Not met": {
    Icon: CircleX,
    cls: "text-notmet",
    bg: "bg-burgundy/10 border-burgundy/25",
  },
};

export function StatusPill({ s }: { s: Status }) {
  const { Icon, cls, bg } = statusMap[s] || statusMap["Partly"];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold ${cls} ${bg}`}>
      <Icon size={13} aria-hidden />
      {s}
    </span>
  );
}

const tagCls: Record<Tag, string> = {
  Case: "border-burgundy/30 text-burgundy bg-burgundy/5",
  Sourced: "border-met/30 text-met bg-met/5",
  Assumed: "border-gold/40 text-gold-deep bg-gold/10",
  Missing: "border-burgundy/50 text-burgundy bg-burgundy/10",
};

export function TagChip({ t }: { t: Tag }) {
  return (
    <span className={`inline-block rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tagCls[t]}`}>
      {t}
    </span>
  );
}

/** Tappable number with source popover. */
export function Num({ fact, children, dark }: { fact: Fact; children: ReactNode; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <span ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`tnum whitespace-nowrap cursor-pointer border-b border-dotted transition-colors ${
          dark ? "border-gold text-on-dark hover:text-gold" : "border-gold-deep hover:text-gold-deep"
        }`}
        title="Tap to view source and evidence provenance"
      >
        {children}
      </button>
      {open && (
        <span
          role="dialog"
          className="fade-slow absolute left-0 top-full z-50 mt-2 block w-72 rounded-lg border border-line-dark bg-espresso p-3.5 text-left text-xs font-normal normal-case tracking-normal text-on-dark shadow-2xl"
        >
          <span className="mb-2 flex items-center justify-between border-b border-line-dark pb-1.5">
            <span className="eyebrow text-gold">Data Provenance</span>
            <TagChip t={fact.tag} />
          </span>
          <span className="block text-sm font-medium text-on-dark">{fact.source}</span>
          <span className="mt-2 block rounded bg-roast p-2 text-on-dark-muted">
            <b className="text-champagne">Underlying Assumption:</b> {fact.assumption}
          </span>
        </span>
      )}
    </span>
  );
}

export function PageHead({
  eyebrow,
  title,
  children,
  caseTag = "Mehta Family Case · Active MVP",
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  caseTag?: string;
}) {
  return (
    <div className="fade-slow mb-8 border-b border-border pb-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="eyebrow text-gold-deep">{eyebrow}</p>
        {caseTag && (
          <span className="inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-cream/95 px-3 py-1 text-xs font-semibold text-walnut shadow-sm">
            <span className="h-2 w-2 rounded-full bg-burgundy" />
            {caseTag}
          </span>
        )}
      </div>
      <h1 className="mt-2 text-3xl font-bold md:text-5xl tracking-tight text-ink">{title}</h1>
      {children && <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{children}</div>}
    </div>
  );
}
