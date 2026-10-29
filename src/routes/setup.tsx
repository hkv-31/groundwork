import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Hourglass } from "lucide-react";
import { useBoard } from "@/lib/store";
import { people, priorityOptions, properties, type PropStatus } from "@/lib/data";
import { PageHead } from "@/components/ui-bits";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Setup- groundwork" },
      {
        name: "description",
        content: "Set priorities, property status and cash constraints before the family meeting.",
      },
      { property: "og:title", content: "Setup- groundwork" },
      {
        property: "og:description",
        content: "Prepare the Mehta family board: priorities, properties, cash.",
      },
    ],
  }),
  component: Setup,
});

const field =
  "w-full rounded-sm border border-input bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-ring transition-colors";
const statuses: PropStatus[] = ["Keep", "Sell", "Rent out", "Redevelop"];

function Setup() {
  const { setup, setSetup } = useBoard();

  const num = (k: "plantNeed" | "liquid" | "reserve", label: string) => (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label} (₹ Cr)</span>
      <input
        type="number"
        className={`${field} tnum mt-1`}
        value={setup[k]}
        onChange={(e) => setSetup({ ...setup, [k]: Number(e.target.value) })}
      />
    </label>
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <PageHead eyebrow="Before the meeting" title="Set the table." />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-ink">Priorities</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {people.map((p) => (
                <label key={p.id} className="block rounded-md border border-border bg-card p-4">
                  <span className="text-sm font-semibold text-ink">{p.name}</span>
                  <select
                    className={`${field} mt-2`}
                    value={setup.priorities[p.id]}
                    onChange={(e) =>
                      setSetup({
                        ...setup,
                        priorities: { ...setup.priorities, [p.id]: e.target.value },
                      })
                    }
                  >
                    {priorityOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">Properties</h2>
            <ul className="mt-4 divide-y border border-border rounded-md bg-card">
              {properties.map((p) => {
                const s = setup.props.find((x) => x.id === p.id) || p;
                const upd = (patch: Partial<typeof s>) =>
                  setSetup({
                    ...setup,
                    props: setup.props.map((x) => (x.id === p.id ? { ...x, ...patch } : x)),
                  });

                return (
                  <li
                    key={p.id}
                    className="grid gap-3 p-4 sm:grid-cols-[1fr_140px_120px] sm:items-center"
                  >
                    <div>
                      <p className="font-semibold text-ink">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.note}</p>
                    </div>
                    <select
                      className={field}
                      value={s.status}
                      onChange={(e) => upd({ status: e.target.value as PropStatus })}
                    >
                      {statuses.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      aria-label={`${p.name} value in crore`}
                      className={`${field} tnum`}
                      value={s.value}
                      onChange={(e) => upd({ value: Number(e.target.value) })}
                    />
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">Meeting & cash</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-4">
              <label className="block">
                <span className="text-xs text-muted-foreground">Meeting date</span>
                <input
                  type="date"
                  className={`${field} mt-1`}
                  value={setup.meetingDate}
                  onChange={(e) => setSetup({ ...setup, meetingDate: e.target.value })}
                />
              </label>
              {num("plantNeed", "Plant need")}
              {num("liquid", "Liquid")}
              {num("reserve", "Reserve")}
            </div>
          </section>
        </div>

        <aside>
          <div className="sticky top-20 rounded-md border border-border bg-card p-5 shadow-sm">
            <p className="eyebrow text-gold-deep">Readiness</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex flex-col gap-1 border-b border-border/60 pb-2.5">
                <span className="text-ink font-medium">Prices</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-partly">
                  <Hourglass size={13} /> Asking listings only; registered sales pending
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-ink">Tax</span>
                <span className="inline-flex items-center gap-1 font-semibold text-partly">
                  <Hourglass size={14} /> Awaiting CA
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-ink">Legal</span>
                <span className="inline-flex items-center gap-1 font-semibold text-partly">
                  <Hourglass size={14} /> Awaiting lawyer
                </span>
              </li>
            </ul>
            <Link
              to="/board"
              className="mt-6 block rounded-sm bg-espresso px-4 py-3 text-center text-sm font-semibold text-on-dark hover:opacity-90 shadow transition-opacity"
            >
              Open the board
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
