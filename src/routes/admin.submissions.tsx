import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listSubmissions } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/submissions")({
  head: () => ({ meta: [{ title: "Submissions | Capacitiq Admin" }, { name: "robots", content: "noindex" }] }),
  component: SubmissionsAdmin,
});

const KINDS = ["all", "contact", "spotter", "pricing_guide", "career", "template_order"] as const;

function SubmissionsAdmin() {
  const listFn = useServerFn(listSubmissions);
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-subs-full"], queryFn: () => listFn() });
  const [filter, setFilter] = useState<typeof KINDS[number]>("all");

  const rows = (data ?? []).filter((r) => filter === "all" || r.kind === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--brand)]">Submissions</h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">All form intakes across the site.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`neu-pill px-4 py-2 text-xs font-medium ${filter === k ? "text-[var(--brand)] neu-in" : "text-[var(--ink-soft)]"}`}
          >
            {k}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-[var(--ink-soft)]">Loading…</p>}
      {error && <p className="text-[var(--destructive)]">{(error as Error).message}</p>}

      <div className="space-y-3">
        {rows.map((s) => (
          <details key={s.id} className="neu-out rounded-2xl p-4">
            <summary className="cursor-pointer flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3 min-w-0">
                <span className="neu-pill px-3 py-0.5 text-[10px] font-semibold text-[var(--brand)]">{s.kind}</span>
                <span className="font-semibold truncate">{s.name ?? "—"}</span>
                <span className="text-[var(--ink-soft)] truncate">{s.email ?? ""}</span>
              </div>
              <span className="text-xs text-[var(--ink-soft)] shrink-0">{new Date(s.created_at).toLocaleString("en-ZA")}</span>
            </summary>
            <pre className="mt-3 text-xs text-[var(--ink-soft)] whitespace-pre-wrap overflow-x-auto neu-in rounded-2xl p-4">
              {JSON.stringify(s.payload, null, 2)}
            </pre>
          </details>
        ))}
        {rows.length === 0 && <p className="text-sm text-[var(--ink-soft)]">No submissions for this filter.</p>}
      </div>
    </div>
  );
}
