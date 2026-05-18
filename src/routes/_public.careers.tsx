import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { listOpenCareers } from "@/lib/content.functions";
import { Plus, Minus } from "lucide-react";
import { NeuButton } from "@/components/neu/NeuButton";
import { NeuModal } from "@/components/neu/NeuModal";
import { NeuInput, NeuTextarea, NeuField } from "@/components/neu/NeuInput";
import { sendCareerApplication } from "@/lib/forms.functions";
import { useModals } from "@/components/ModalsProvider";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Capacitiq" },
      { name: "description", content: "Join Capacitiq as a remote, performance-based contractor. Open roles in sales, design, consulting, and operations across South Africa." },
      { property: "og:title", content: "Careers at Capacitiq" },
      { property: "og:description", content: "Remote, performance-based roles across South Africa." },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: CareersPage,
});

function CareersPage() {
  const fetchRoles = useServerFn(listOpenCareers);
  const { data, isLoading } = useQuery({ queryKey: ["careers"], queryFn: () => fetchRoles() });
  const [applyRole, setApplyRole] = React.useState<string | null>(null);
  const { openSpotter } = useModals();

  return (
    <div className="mx-auto max-w-5xl px-5">
      <section className="pt-12 md:pt-20 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Careers</p>
        <h1 className="mt-3 text-5xl md:text-6xl font-bold tracking-tight text-balance">Remote, performance-based, South African.</h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--ink-soft)]">
          We hire contractors who can think and ship. Pay scales with what you deliver, not with hours logged.
        </p>
      </section>

      <section className="pb-10">
        <h2 className="text-2xl font-bold mb-5">Open roles</h2>
        {isLoading && <p className="text-[var(--ink-soft)]">Loading…</p>}
        {!isLoading && (!data || data.length === 0) && (
          <div className="neu-out rounded-3xl p-10 text-center text-[var(--ink-soft)]">No open roles right now. Check back soon.</div>
        )}
        <div className="space-y-4">
          {data?.map((r) => (
            <RoleAccordion
              key={r.id}
              r={r}
              onApply={() => (r.title.toLowerCase().includes("spotter") ? openSpotter() : setApplyRole(r.title))}
            />
          ))}
        </div>
      </section>

      <ApplyModal role={applyRole} onClose={() => setApplyRole(null)} />
    </div>
  );
}

function ApplyModal({ role, onClose }: { role: string | null; onClose: () => void }) {
  const submit = useServerFn(sendCareerApplication);
  const [busy, setBusy] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!role) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await submit({
        data: {
          role_title: role,
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          phone: String(fd.get("phone") || ""),
          portfolio_url: String(fd.get("portfolio_url") || ""),
          cover_letter: String(fd.get("cover_letter") || ""),
        },
      });
      toast.success("Application sent. We'll review and revert within two weeks.");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <NeuModal open={!!role} onClose={onClose} title={role ? `Apply: ${role}` : ""}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <NeuField label="Full name" required><NeuInput name="name" required /></NeuField>
          <NeuField label="Email" required><NeuInput type="email" name="email" required /></NeuField>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <NeuField label="Phone"><NeuInput name="phone" /></NeuField>
          <NeuField label="Portfolio / LinkedIn"><NeuInput type="url" name="portfolio_url" placeholder="https://" /></NeuField>
        </div>
        <NeuField label="Why you?" required>
          <NeuTextarea name="cover_letter" required minLength={10} maxLength={4000} placeholder="Tell us why you'd be a great fit." />
        </NeuField>
        <NeuButton type="submit" variant="primary" size="lg" disabled={busy} className="w-full">
          {busy ? "Sending…" : "Submit application"}
        </NeuButton>
      </form>
    </NeuModal>
  );
}
