import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listSubmissions } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const fetchSubs = useServerFn(listSubmissions);
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-subs"], queryFn: () => fetchSubs() });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">Manage content and review submissions.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Blog posts", to: "/admin" as const, hint: "Editor coming next" },
          { label: "Portfolio", to: "/admin" as const, hint: "Editor coming next" },
          { label: "Templates", to: "/admin" as const, hint: "Editor coming next" },
          { label: "Careers", to: "/admin" as const, hint: "Editor coming next" },
        ].map((c) => (
          <Link key={c.label} to={c.to} className="neu-out rounded-2xl p-5">
            <p className="font-semibold">{c.label}</p>
            <p className="text-xs text-[var(--ink-soft)] mt-1">{c.hint}</p>
          </Link>
        ))}
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">Recent submissions</h2>
        {isLoading && <p className="text-[var(--ink-soft)]">Loading…</p>}
        {error && <p className="text-[var(--destructive)]">{(error as Error).message}</p>}
        <div className="space-y-3">
          {data?.map((s) => (
            <div key={s.id} className="neu-out rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3 text-xs text-[var(--ink-soft)]">
                <span className="neu-pill px-3 py-1">{s.kind}</span>
                <span>{new Date(s.created_at).toLocaleString("en-ZA")}</span>
              </div>
              <p className="mt-2 font-medium">{s.name} <span className="text-[var(--ink-soft)] font-normal">· {s.email}</span></p>
              <pre className="mt-2 text-xs text-[var(--ink-soft)] whitespace-pre-wrap overflow-x-auto">{JSON.stringify(s.payload, null, 2)}</pre>
            </div>
          ))}
          {data && data.length === 0 && <p className="text-[var(--ink-soft)] text-sm">No submissions yet.</p>}
        </div>
      </section>
    </div>
  );
}
