import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/ui-bits";

export const Route = createFileRoute("/how")({
  head: () => ({
    meta: [
      { title: "How I got here- groundwork" },
      {
        name: "description",
        content: "The problem I picked, the user, what I left out, key assumptions and what AI got wrong.",
      },
      { property: "og:title", content: "How I got here- groundwork" },
      { property: "og:description", content: "An editorial note on the thinking behind the board." },
    ],
  }),
  component: How,
});

const map = [
  ["Mr. Mehta", "Malabar Hill, Alibaug", "Legacy- keep addresses in the family name"],
  ["Mrs. Mehta", "Malabar Hill", "Closeness- keep children within a short drive"],
  ["Riya", "Cash (₹80 Cr liquid pool)", "Liquidity- fair value now, in cash, not bricks"],
  ["Arjun", "Worli flat (proposed)", "Independence- a home of his own, close but separate"],
  ["Business", "Liquid ₹40 Cr", "Plant expansion needs ₹40 Cr by Jun 2027"],
];

function How() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <PageHead eyebrow="Editorial" title="How I got here." />

      <article className="space-y-14 text-base md:text-lg leading-relaxed text-ink">
        <S n="01" t="The problem I picked and why">
          Family property meetings stall on one loud question- "should we buy Arjun the flat?"- while the real constraints (a ₹40 Cr plant bill, a lease ending, a fairness debt to Riya) sit in separate spreadsheets. I isolated the Worli purchase because it is the most urgent, the hardest to undo, consumes cash the plant needs, and dictates what "fairness" means between the siblings.
        </S>

        <S n="02" t="Who my user is">
          Anika, a senior wealth advisor. She runs the meeting on a tablet at the family's dining table. She needs to move fast, keep everyone visible, and never present a number she cannot source. The advisory firm pays for the product because it turns opinion wars into signed next steps.
        </S>

        <S n="03" t="What I left out and why">
          Vendor API integrations, automated tax engines, complex succession simulators, and any recommendation algorithm. I left them out to protect the advisor and the meeting. The board shows mathematical trade-offs; the family decides.
        </S>

        <section>
          <p className="eyebrow text-gold-deep font-semibold">04</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-ink">Map of people, money and property</h2>
          <p className="mt-3 text-muted-foreground text-sm">
            Four people, ₹200 Cr total wealth (₹120 Cr property in five holdings, ₹80 Cr liquid), a ₹40 Cr plant expansion, and conflicting mandates.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-y border-border text-sm">
              <tbody>
                {map.map(([a, b, c]) => (
                  <tr key={a} className="border-b border-border/70 last:border-0">
                    <td className="py-3 font-semibold text-ink whitespace-nowrap pr-4">{a}</td>
                    <td className="py-3 text-ink/90 pr-4">{b}</td>
                    <td className="py-3 text-muted-foreground">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <S n="05" t="Key assumptions">
          A 50% property-share target, a ₹30 Cr untouchable reserve, 14.95% capital gains as a placeholder, and asking prices standing in for transacted ones. The assumption that changes the answer most is the ₹30 Cr reserve: the break-even reserve is ₹23.95 Cr (₹80 Cr liquid − ₹16.05 Cr flat outlay − ₹40 Cr plant). If the family is comfortable below ₹30 Cr, they can buy the flat with no asset sale at all. On rent versus buy, at 5% appreciation and 7% alternative fund return, buying beats renting only if appreciation exceeds 6.6% a year.
        </S>

        <S n="06" t="What AI got wrong and how I caught it">
          The research register put ₹8.5 Cr on each Thane 2BHK to hit ₹120 Cr, contradicting its own comparables (which list at ₹0.87 to 1.73 Cr). I caught this by reading the register's limitation notes; I fixed it by using ₹1.5 Cr each and moving the difference to Malabar Hill and BKC where evidence ranges are widest. Early drafts also treated asking listings as registered transactions and stated Mumbai yields from memory. I relabelled them as asking listings and flagged what was missing for CA and legal sign-off.
        </S>
      </article>
    </main>
  );
}

function S({ n, t, children }: { n: string; t: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="eyebrow text-gold-deep font-semibold">{n}</p>
      <h2 className="mt-2 text-2xl md:text-3xl font-bold text-ink">{t}</h2>
      <p className="mt-4 text-muted-foreground leading-relaxed">{children}</p>
    </section>
  );
}
