import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listSubmissions } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard | Capacitiq Admin" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const fetchSubs = useServerFn(listSubmissions);
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-subs"], queryFn: () => fetchSubs() });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--brand)]">Dashboard</h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">Manage content and review submissions.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Blog posts", to: "/admin/blog" },
          { label: "Portfolio", to: "/admin/portfolio" },
          { label: "Templates", to: "/admin/templates" },
          { label: "Careers", to: "/admin/careers" },
        ].map((c) => (
          <Link key={c.label} to={c.to as never} className="neu-out rounded-2xl p-5 hover:translate-y-[-1px] transition">
            <p className="font-semibold text-[var(--brand)]">{c.label}</p>
            <p className="text-xs text-[var(--ink-soft)] mt-1">Open editor →</p>
          </Link>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--brand)]">Recent submissions</h2>
          <Link to="/admin/submissions" className="text-sm text-[var(--brand)] hover:underline">View all →</Link>
        </div>
        {isLoading && <p className="text-[var(--ink-soft)]">Loading…</p>}
        {error && <p className="text-[var(--destructive)]">{(error as Error).message}</p>}
        <div className="space-y-3">
          {data?.slice(0, 10).map((s) => (
            <div key={s.id} className="neu-out rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3 text-xs text-[var(--ink-soft)]">
                <span className="neu-pill px-3 py-1">{s.kind}</span>
                <span>{new Date(s.created_at).toLocaleString("en-ZA")}</span>
              </div>
              <p className="mt-2 font-medium">{s.name} <span className="text-[var(--ink-soft)] font-normal">· {s.email}</span></p>
            </div>
          ))}
          {data && data.length === 0 && <p className="text-[var(--ink-soft)] text-sm">No submissions yet.</p>}
        </div>
      </section>
    </div>
  );
}
