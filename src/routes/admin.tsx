import { createFileRoute, Outlet, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

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

  return (
    <div className="min-h-screen">
      {authed && (
        <header className="border-b border-[var(--line)]/60 bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link to="/admin" className="font-bold">Capacitiq Admin</Link>
              <nav className="hidden md:flex gap-4 text-sm text-[var(--ink-soft)]">
                <Link to="/admin" className="hover:text-[var(--ink)]">Dashboard</Link>
              </nav>
            </div>
            <button
              className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]"
              onClick={async () => { await supabase.auth.signOut(); window.location.href = "/admin/login"; }}
            >Sign out</button>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-6xl px-5 py-10"><Outlet /></main>
    </div>
  );
}
