import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { NeuInput, NeuField } from "@/components/neu/NeuInput";
import { NeuButton } from "@/components/neu/NeuButton";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password | Capacitiq" }, { name: "robots", content: "noindex" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const nav = useNavigate();
  const [ready, setReady] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    // Supabase will exchange the recovery code in the URL hash and emit PASSWORD_RECOVERY.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // Also accept a pre-existing session (some recovery flows complete before listener attaches).
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") || "");
    const confirm = String(fd.get("confirm") || "");
    if (password !== confirm) { setErr("Passwords do not match."); return; }
    setBusy(true); setErr(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setErr(error.message);
    else {
      setInfo("Password updated. Redirecting…");
      setTimeout(() => nav({ to: "/admin" }), 1200);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-6">
      <Logo />
      <div className="neu-out rounded-3xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-[var(--brand)] mb-4">Set a new password</h1>
        {!ready ? (
          <p className="text-sm text-[var(--ink-soft)]">
            Waiting for the recovery link… Open this page using the link in your email.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <NeuField label="New password" required hint="Min 8 characters">
              <NeuInput type="password" name="password" required minLength={8} autoComplete="new-password" />
            </NeuField>
            <NeuField label="Confirm password" required>
              <NeuInput type="password" name="confirm" required minLength={8} autoComplete="new-password" />
            </NeuField>
            {err && <p className="text-sm text-[var(--destructive)]">{err}</p>}
            {info && <p className="text-sm text-[var(--brand)]">{info}</p>}
            <NeuButton type="submit" variant="primary" size="lg" disabled={busy} className="w-full">
              {busy ? "Updating…" : "Update password"}
            </NeuButton>
          </form>
        )}
        <div className="mt-6 text-xs">
          <Link to="/admin/login" className="text-[var(--brand)] hover:underline">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
