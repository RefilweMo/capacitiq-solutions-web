import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NeuInput, NeuField } from "@/components/neu/NeuInput";
import { NeuButton } from "@/components/neu/NeuButton";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login" }, { name: "robots", content: "noindex" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true); setErr(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
    });
    setBusy(false);
    if (error) setErr(error.message);
    else nav({ to: "/admin" });
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={onSubmit} className="neu-out rounded-3xl p-8 w-full max-w-md space-y-5">
        <h1 className="text-2xl font-bold">Admin sign in</h1>
        <NeuField label="Email" required><NeuInput type="email" name="email" required autoComplete="email" /></NeuField>
        <NeuField label="Password" required><NeuInput type="password" name="password" required autoComplete="current-password" /></NeuField>
        {err && <p className="text-sm text-[var(--destructive)]">{err}</p>}
        <NeuButton type="submit" variant="primary" size="lg" disabled={busy} className="w-full">
          {busy ? "Signing in…" : "Sign in"}
        </NeuButton>
      </form>
    </div>
  );
}
