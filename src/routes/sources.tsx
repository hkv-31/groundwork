import { createFileRoute } from "@tanstack/react-router";
import { sourcesTable } from "@/lib/data";
import { PageHead, TagChip } from "@/components/ui-bits";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "Sources- groundwork" },
      {
        name: "description",
        content: "Every figure on the board, its tag, source and limits.",
      },
      { property: "og:title", content: "Sources- groundwork" },
      {
        property: "og:description",
        content: "Case, Sourced, Assumed or Missing- every number accounted for.",
      },
    ],
  }),
  component: Sources,
});

function Sources() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-8 min-h-screen">
      <PageHead eyebrow="Provenance" title="Sources & limits.">
        Case = from the family. Sourced = third party. Assumed = advisor judgment. Missing = awaiting input.
      </PageHead>

      <div className="overflow-x-auto rounded-md border border-border bg-card shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground bg-cream/40">
              <th className="p-3 font-medium">Data</th>
              <th className="p-3 font-medium">Tag</th>
              <th className="p-3 font-medium">Source</th>
              <th className="p-3 font-medium">Limit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {sourcesTable.map((s) => (
              <tr key={s.item} className="border-b border-border/60 last:border-0 hover:bg-cream/20">
                <td className="tnum p-3 font-semibold text-ink">{s.item}</td>
                <td className="p-3">
                  <TagChip t={s.tag} />
                </td>
                <td className="p-3 text-ink/90">{s.source}</td>
                <td className="p-3 text-muted-foreground">{s.limit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
