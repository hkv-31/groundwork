import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { compute, defaultSetup, moves, presets, type MoveId, type Result, type Setup } from "./data";

export interface LogEntry { id: number; time: string; action: string; result: Result }

interface Ctx {
  setup: Setup;
  setSetup: (s: Setup) => void;
  on: Set<MoveId>;
  toggle: (m: MoveId) => void;
  applyPreset: (id: string) => void;
  preset: string | null;
  result: Result;
  baseline: Result;
  log: LogEntry[];
}

const C = createContext<Ctx | null>(null);
const stamp = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export function BoardProvider({ children }: { children: ReactNode }) {
  const [setup, setSetup] = useState<Setup>(defaultSetup);
  const [on, setOn] = useState<Set<MoveId>>(new Set());
  const [preset, setPreset] = useState<string | null>("P0");
  const [log, setLog] = useState<LogEntry[]>([]);

  const push = (action: string, next: Set<MoveId>) =>
    setLog((l) => [{ id: Date.now() + Math.random(), time: stamp(), action, result: compute(next, setup) }, ...l]);

  const value = useMemo<Ctx>(() => ({
    setup, setSetup, on, preset, log,
    result: compute(on, setup),
    baseline: compute(new Set(), setup),
    toggle: (m) => {
      const next = new Set(on);
      const was = next.has(m);
      was ? next.delete(m) : next.add(m);
      setOn(next); setPreset(null);
      push(`${was ? "Removed" : "Added"}: ${moves.find((x) => x.id === m)!.label}`, next);
    },
    applyPreset: (id) => {
      const p = presets.find((x) => x.id === id)!;
      const next = new Set(p.moves);
      setOn(next); setPreset(id);
      push(`Scenario ${p.id} — ${p.name}`, next);
    },
  }), [setup, on, preset, log]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export const useBoard = () => {
  const c = useContext(C);
  if (!c) throw new Error("useBoard outside provider");
  return c;
};
