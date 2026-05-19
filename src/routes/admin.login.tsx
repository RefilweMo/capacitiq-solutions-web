import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { NeuInput, NeuField } from "@/components/neu/NeuInput";
import { NeuButton } from "@/components/neu/NeuButton";
import { ensureAdminUser } from "@/lib/admin-bootstrap.functions";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login | Capacitiq" }, { name: "robots", content: "noindex" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const bootstrap = useServerFn(ensureAdminUser);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "forgot" | "bootstrap">("signin");

  async function onSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true); setErr(null); setInfo(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email") || "").trim(),
      password: String(fd.get("password") || ""),
    });
    setBusy(false);
    if (error) setErr(error.message);
    else nav({ to: "/admin" });
  }

  async function onForgot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true); setErr(null); setInfo(null);
    const { error } = await supabase.auth.resetPasswordForEmail(
      String(fd.get("email") || "").trim(),
      { redirectTo: `${window.location.origin}/reset-password` },
    );
    setBusy(false);
    if (error) setErr(error.message);
    else setInfo("Check your inbox for a password reset link.");
  }

  async function onBootstrap(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true); setErr(null); setInfo(null);
    try {
      await bootstrap({
        data: {
          email: String(fd.get("email") || "").trim(),
          password: String(fd.get("password") || ""),
        },
      });
      setInfo("Admin account is ready. You can sign in now.");
      setMode("signin");
    } catch (e: any) {
      setErr(e?.message ?? "Bootstrap failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-6">
      <Logo />
      <div className="neu-out rounded-3xl p-8 w-full max-w-md">
        {mode === "signin" && (
          <form onSubmit={onSignIn} className="space-y-5">
            <h1 className="text-2xl font-bold text-[var(--brand)]">Admin sign in</h1>
            <NeuField label="Email" required><NeuInput type="email" name="email" required autoComplete="email" defaultValue="admin@capacitiq.co.za" /></NeuField>
            <NeuField label="Password" required><NeuInput type="password" name="password" required autoComplete="current-password" /></NeuField>
            {err && <p className="text-sm text-[var(--destructive)]">{err}</p>}
            {info && <p className="text-sm text-[var(--brand)]">{info}</p>}
            <NeuButton type="submit" variant="primary" size="lg" disabled={busy} className="w-full">
              {busy ? "Signing in…" : "Sign in"}
            </NeuButton>
            <div className="flex justify-between text-xs">
              <button type="button" onClick={() => { setMode("forgot"); setErr(null); setInfo(null); }} className="text-[var(--brand)] hover:underline">
                Forgot password?
              </button>
              <button type="button" onClick={() => { setMode("bootstrap"); setErr(null); setInfo(null); }} className="text-[var(--brand)] hover:underline">
                First-time setup
              </button>
            </div>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={onForgot} className="space-y-5">
            <h1 className="text-2xl font-bold text-[var(--brand)]">Reset password</h1>
            <p className="text-sm text-[var(--ink-soft)]">We'll email you a reset link.</p>
            <NeuField label="Email" required><NeuInput type="email" name="email" required defaultValue="admin@capacitiq.co.za" /></NeuField>
            {err && <p className="text-sm text-[var(--destructive)]">{err}</p>}
            {info && <p className="text-sm text-[var(--brand)]">{info}</p>}
            <NeuButton type="submit" variant="primary" size="lg" disabled={busy} className="w-full">
              {busy ? "Sending…" : "Send reset link"}
            </NeuButton>
            <button type="button" onClick={() => setMode("signin")} className="text-xs text-[var(--brand)] hover:underline">Back to sign in</button>
          </form>
        )}

        {mode === "bootstrap" && (
          <form onSubmit={onBootstrap} className="space-y-5">
            <h1 className="text-2xl font-bold text-[var(--brand)]">First-time setup</h1>
            <p className="text-sm text-[var(--ink-soft)]">
              Creates the admin account (or resets its password) for the whitelisted email.
              Use this if you can't sign in.
            </p>
            <NeuField label="Admin email" required><NeuInput type="email" name="email" required defaultValue="admin@capacitiq.co.za" /></NeuField>
            <NeuField label="New password" required hint="Min 8 characters"><NeuInput type="password" name="password" required minLength={8} /></NeuField>
            {err && <p className="text-sm text-[var(--destructive)]">{err}</p>}
            {info && <p className="text-sm text-[var(--brand)]">{info}</p>}
            <NeuButton type="submit" variant="primary" size="lg" disabled={busy} className="w-full">
              {busy ? "Setting up…" : "Create / reset admin"}
            </NeuButton>
            <button type="button" onClick={() => setMode("signin")} className="text-xs text-[var(--brand)] hover:underline">Back to sign in</button>
          </form>
        )}
      </div>
      <Link to="/" className="text-xs text-[var(--ink-soft)] hover:text-[var(--brand)]">← Back to site</Link>
    </div>
  );
}
