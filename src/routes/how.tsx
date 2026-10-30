import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHead, useCurrentDay } from "@/components/ui-bits";
import { relativeTimeline } from "@/lib/data";

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
  useCurrentDay();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-10 md:py-16">
      <PageHead eyebrow="Editorial" title="How I got here." />

      <article className="space-y-20 text-sm md:text-base leading-8 text-ink">
        <S n="01" t="The situation I designed for">
          Family-wealth meetings rarely stall because there are no options. They stall because the options are spread across spreadsheets, and each person measures a good answer differently. A home purchase can affect liquidity, business funding, fairness, tax, legacy and family relationships at the same time. Groundwork turns that one high-stakes decision into a shared board where everyone can see the trade-offs together.
          <br /><br />
          The Mehta family is the working case: ₹200 Cr of wealth, ₹120 Cr in property, ₹80 Cr liquid, a ₹40 Cr plant expansion ahead, and one urgent question- should the family buy Arjun a ₹15 Cr Worli flat?
        </S>

        <S n="02" t="Who the user is">
          The user is a senior wealth advisor like Anika. She runs a family meeting from a tablet and needs to move quickly, keep every stakeholder visible, and never present a number she cannot explain or source. Groundwork gives her one place to frame the decision, test moves, show consequences and leave with signed next steps.
          <br /><br />
          The buyer is the advisory firm. It pays because turning opinion wars into clear decisions protects the family relationship, the advisor&apos;s trust and the firm&apos;s long-term retainer.
        </S>

        <S n="03" t="What I left out and why">
          <p>I left these out to protect the advisor and keep the meeting understandable. The board shows mathematical trade-offs; the family decides.</p>
          <PointerList
            items={[
              ["Vendor API integrations", "The demo uses a clear, inspectable case rather than pretending every data feed is live."],
              ["Automated tax engines", "Tax and legal questions stay visible as follow-ups for the CA and lawyer."],
              ["Complex succession simulators", "The first meeting focuses on the decision in front of the family."],
              ["A recommendation algorithm", "Groundwork exposes the balance; it does not decide what the family should value."],
            ]}
          />
        </S>

        <section>
          <p className="eyebrow text-gold-deep font-semibold">04</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-ink">Map of people, money and property</h2>
          <p className="mt-3 text-muted-foreground text-sm">
            Four people, ₹200 Cr total wealth, ₹120 Cr in five property holdings and ₹80 Cr liquid. The family is balancing a Worli redevelopment vote ({relativeTimeline("2026-12-13")}) with a ₹40 Cr plant expansion ({relativeTimeline("2028-11-01")} from today).
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
                  <li className="flex justify-between"><span>BKC office floor (lease end · {relativeTimeline("2028-05-01")})</span><span className="font-medium text-ink">₹47 Cr</span></li>
                  <li className="flex justify-between"><span>Worli 3BHK (vote · {relativeTimeline("2026-12-13")})</span><span className="font-medium text-ink">₹15 Cr</span></li>
                  <li className="flex justify-between"><span>Alibaug villa (Kihim)</span><span className="font-medium text-ink">₹8 Cr</span></li>
                  <li className="flex justify-between"><span>Thane 2BHK × 2</span><span className="font-medium text-ink">₹3 Cr</span></li>
                </ul>
              </div>

              <div className="rounded border border-border/80 bg-cream/30 p-3.5">
                <p className="text-xs font-bold uppercase tracking-wider text-walnut">Liquid Assets · ₹80 Cr</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li className="flex justify-between"><span>Plant capex ({relativeTimeline("2028-11-01")})</span><span className="font-medium text-ink">₹40 Cr</span></li>
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
                  <p className="text-muted-foreground text-[11px] mt-0.5">Own home ahead of the wedding ({relativeTimeline("2027-03-01")})</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <S n="05" t="Key assumptions">
          <PointerList
            items={[
              ["Portfolio target", "Property share is measured against a 50% target, with asking prices standing in for transacted ones."],
              ["Reserve assumption", "The ₹30 Cr untouchable reserve changes the answer most. Break-even is ₹23.95 Cr: ₹80 Cr liquid − ₹16.05 Cr flat outlay − ₹40 Cr plant."],
              ["Buy versus rent", "At 5% appreciation and a 7% alternative fund return, buying beats renting only if appreciation exceeds 6.6% a year."],
              ["Where to verify", <>Every assumption, confidence rating and limitation is cross-referenced on the <Link to="/sources" className="font-semibold text-gold-deep underline hover:opacity-80">Sources &amp; Limits page</Link>.</>],
            ]}
          />
        </S>

        <S n="06" t="What AI got wrong and how I caught it">
          <PointerList
            items={[
              ["Fabricated context", "The first draft invented ages, dates, sources, a custodian statement, a ₹12 Cr locked-liquidity constraint, a CFO capex memo, machinery FX swings and speculative gift-deed stamp-duty ranges."],
              ["Case corrections", "I checked the brief, restored its citations, corrected the family ages, aligned the deadlines, and tagged the 50% target and 9.5% LAP as assumed with no source."],
              ["Property-value correction", "The initial register put ₹8.5 Cr on each Thane 2BHK despite its own comparables. I corrected this to ₹1.5 Cr each and moved the difference to Malabar Hill and BKC."],
              ["Evidence discipline", "Asking listings are labelled as asking listings, not transactions, and missing CA or legal sign-off is called out instead of filled in from memory."],
            ]}
          />
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
      <div className="mt-4 text-muted-foreground leading-8">{children}</div>
    </section>
  );
}

function PointerList({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <ul className="mt-6 grid gap-3 md:grid-cols-2">
      {items.map(([title, detail]) => (
        <li key={title} className="rounded-md border border-border bg-card/45 p-4">
          <p className="font-semibold text-ink">
            <span className="mr-2 text-gold-deep">→</span>{title}
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
        </li>
      ))}
    </ul>
  );
}
