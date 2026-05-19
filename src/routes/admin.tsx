import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, FileText, Briefcase, ShoppingBag, Users, Inbox, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/admin/templates", label: "Templates", icon: ShoppingBag },
  { to: "/admin/careers", label: "Careers", icon: Users },
  { to: "/admin/submissions", label: "Submissions", icon: Inbox },
];

function AdminLayout() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return <div className="p-12 text-center text-[var(--ink-soft)]">Loading…</div>;

  if (!authed && typeof window !== "undefined" && window.location.pathname !== "/admin/login") {
    window.location.href = "/admin/login";
    return null;
  }

  // Login screen takes over layout
  if (pathname === "/admin/login") return <Outlet />;

  return (
    <div className="min-h-screen flex bg-[var(--surface)]">
      <aside className="hidden lg:flex flex-col w-64 p-5 gap-2 border-r border-[var(--line)]/40">
        <div className="mb-6"><Logo to="/admin" /></div>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to as never}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active ? "neu-in text-[var(--brand)]" : "text-[var(--ink-soft)] hover:text-[var(--brand)]"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={async () => { await supabase.auth.signOut(); window.location.href = "/admin/login"; }}
          className="mt-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-[var(--ink-soft)] hover:text-[var(--brand)]"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="lg:hidden border-b border-[var(--line)]/40 p-4 flex items-center justify-between">
          <Logo to="/admin" />
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = "/admin/login"; }}
            className="text-sm text-[var(--ink-soft)]"
          >Sign out</button>
        </header>
        <nav className="lg:hidden flex gap-2 overflow-x-auto p-4 border-b border-[var(--line)]/40">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={`neu-pill px-4 py-2 text-xs whitespace-nowrap ${active ? "text-[var(--brand)] font-semibold" : "text-[var(--ink-soft)]"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-6 lg:p-10 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
