import { createFileRoute, Link } from "@tanstack/react-router";
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


function How() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <PageHead eyebrow="Editorial" title="How I got here." />

      <article className="space-y-14 text-base md:text-lg leading-relaxed text-ink">
        <S n="01" t="The problem I picked and why">
          Family property meetings stall on one loud question- "should we buy Arjun the flat?"- while the real constraints (a ₹40 Cr plant bill needed ~Nov 2028, a lease ending ~May 2028, a fairness debt to Riya) sit in separate spreadsheets. I isolated the Worli purchase because it is the most urgent, the hardest to undo, consumes cash the plant needs, and dictates what "fairness" means between the siblings.
        </S>

        <S n="02" t="Who my user is">
          Anika, a senior wealth advisor. She runs the meeting on a tablet at the family's dining table. She needs to move fast, keep everyone visible, and never present a number she cannot source. Who pays: the advisor firm. The firm pays because turning opinion wars into signed next steps protects advisory retainers and family trust.
        </S>

        <S n="03" t="What I left out and why">
          Vendor API integrations, automated tax engines, complex succession simulators, and any recommendation algorithm. I left them out to protect the advisor and the meeting. The board shows mathematical trade-offs; the family decides.
        </S>

        <section>
          <p className="eyebrow text-gold-deep font-semibold">04</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-ink">Map of people, money and property</h2>
          <p className="mt-3 text-muted-foreground text-sm">
            Four people, ₹200 Cr total wealth (₹120 Cr property in five holdings, ₹80 Cr liquid), a ₹40 Cr plant expansion needed ~Nov 2028, and conflicting mandates.
          </p>
          <div className="mt-6 rounded-md border border-border bg-card p-5 space-y-5">
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-border pb-4 gap-2 text-center sm:text-left">
              <div>
                <span className="eyebrow text-gold-deep">Total Wealth</span>
                <p className="font-display text-3xl font-bold text-ink">₹200 Cr</p>
              </div>
              <div className="flex gap-4 text-xs">
                <span className="rounded bg-cream px-3 py-1 font-semibold text-ink border border-border">
                  Property: ₹120 Cr (60%)
                </span>
                <span className="rounded bg-cream px-3 py-1 font-semibold text-ink border border-border">
                  Liquid: ₹80 Cr (40%)
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded border border-border/80 bg-cream/30 p-3.5">
                <p className="text-xs font-bold uppercase tracking-wider text-walnut">Property Book · ₹120 Cr</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li className="flex justify-between"><span>Malabar Hill 5BHK</span><span className="font-medium text-ink">₹47 Cr</span></li>
                  <li className="flex justify-between"><span>BKC office floor (ends ~May 2028)</span><span className="font-medium text-ink">₹47 Cr</span></li>
                  <li className="flex justify-between"><span>Worli 3BHK (vote ~13 Dec 2026)</span><span className="font-medium text-ink">₹15 Cr</span></li>
                  <li className="flex justify-between"><span>Alibaug villa (Kihim)</span><span className="font-medium text-ink">₹8 Cr</span></li>
                  <li className="flex justify-between"><span>Thane 2BHK × 2</span><span className="font-medium text-ink">₹3 Cr</span></li>
                </ul>
              </div>

              <div className="rounded border border-border/80 bg-cream/30 p-3.5">
                <p className="text-xs font-bold uppercase tracking-wider text-walnut">Liquid Assets · ₹80 Cr</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li className="flex justify-between"><span>Plant capex (needed ~Nov 2028)</span><span className="font-medium text-ink">₹40 Cr</span></li>
                  <li className="flex justify-between"><span>Minimum untouchable reserve</span><span className="font-medium text-ink">₹30 Cr</span></li>
                  <li className="flex justify-between"><span>Uncommitted working liquidity</span><span className="font-medium text-ink">₹10 Cr</span></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-walnut mb-2.5">Stakeholder Wishes</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded border border-border/60 bg-cream/20 p-2.5 text-xs">
                  <span className="font-semibold text-ink">Mr. Mehta (62)</span> · <span className="text-gold-deep font-medium">Legacy</span>
                  <p className="text-muted-foreground text-[11px] mt-0.5">Keep family addresses in family name</p>
                </div>
                <div className="rounded border border-border/60 bg-cream/20 p-2.5 text-xs">
                  <span className="font-semibold text-ink">Mrs. Mehta (58)</span> · <span className="text-gold-deep font-medium">Closeness</span>
                  <p className="text-muted-foreground text-[11px] mt-0.5">Keep children within short drive</p>
                </div>
                <div className="rounded border border-border/60 bg-cream/20 p-2.5 text-xs">
                  <span className="font-semibold text-ink">Riya (34)</span> · <span className="text-gold-deep font-medium">Liquidity</span>
                  <p className="text-muted-foreground text-[11px] mt-0.5">Fair cash value now, not bricks</p>
                </div>
                <div className="rounded border border-border/60 bg-cream/20 p-2.5 text-xs">
                  <span className="font-semibold text-ink">Arjun (30)</span> · <span className="text-gold-deep font-medium">Independence</span>
                  <p className="text-muted-foreground text-[11px] mt-0.5">Own home ahead of Mar 2027 wedding</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <S n="05" t="Key assumptions">
          A 50% property-share target, a ₹30 Cr untouchable reserve, 14.95% capital gains as a placeholder, and asking prices standing in for transacted ones. The assumption that changes the answer most is the ₹30 Cr reserve: the break-even reserve is ₹23.95 Cr (₹80 Cr liquid − ₹16.05 Cr flat outlay − ₹40 Cr plant). If the family is comfortable below ₹30 Cr, they can buy the flat with no asset sale at all. On rent versus buy, at 5% appreciation and 7% alternative fund return, buying beats renting only if appreciation exceeds 6.6% a year. Every underlying assumption, confidence rating, and limitation is cross-referenced directly on the <Link to="/sources" className="font-semibold text-gold-deep underline hover:opacity-80">Sources &amp; Limits page</Link>.
        </S>

        <S n="06" t="What AI got wrong and how I caught it">
          The build tool invented ages, dates and sources, caught by checking against the brief. Specifically, it fabricated a "Sep 2026 balance sheet", a "custodian statement", a "₹12 Cr locked" liquidity constraint, a "CFO capex memo", and machinery FX swings of 10–15%, along with speculative ranges on gift deed stamp duty. I stripped these hallucinations out, restored the case citations to the assignment brief, corrected family ages (Mr. Mehta 62, Mrs. Mehta 58, Riya 34, Arjun 30), aligned deadlines (broker price lapses Sat 31 Oct 2026, Worli society vote ~13 Dec 2026, plant cash needed ~Nov 2028), and tagged the 50% target and 9.5% LAP as Assumed with no source. Additionally, the initial research register put ₹8.5 Cr on each Thane 2BHK to hit ₹120 Cr, contradicting its own comparables (which list at ₹0.87 to 1.73 Cr). I caught this by reading the register's limitation notes; I fixed it by using ₹1.5 Cr each and moving the difference to Malabar Hill and BKC where evidence ranges are widest. Early drafts also treated asking listings as registered transactions and stated Mumbai yields from memory; I relabelled them as asking listings and flagged what was missing for CA and legal sign-off.
        </S>

        <S n="07" t="Roadmap">
          Next product iterations expand into direct vendor data feeds (live MLS broker asking feeds and IGR / Zapkey registered transaction registries) to eliminate reliance on static comparables. We are also building role-based workflow workspaces for external family professionals: the CA to input verified Section 54 computations and capital gain deposit accounts; the lawyer to certify title searches and gift deed structures; and the valuer to upload certified property appraisals.
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
