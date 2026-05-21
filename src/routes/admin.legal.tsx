import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { listLegalPages, updateLegalPage } from "@/lib/content.functions";
import { NeuButton } from "@/components/neu/NeuButton";
import { NeuInput, NeuField } from "@/components/neu/NeuInput";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/legal")({
  head: () => ({ meta: [{ title: "Legal Pages | Admin" }, { name: "robots", content: "noindex" }] }),
  component: LegalAdmin,
});

function LegalAdmin() {
  const fetchAll = useServerFn(listLegalPages);
  const save = useServerFn(updateLegalPage);
  const { data, isLoading, refetch } = useQuery({ queryKey: ["legal-admin"], queryFn: () => fetchAll() });

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--brand)]">Legal Pages</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">Edit policy content. Changes go live immediately.</p>

      {isLoading && <p className="mt-10 text-[var(--ink-soft)]">Loading…</p>}

      <div className="mt-10 space-y-6">
        {data?.map((p) => (
          <PageEditor key={p.slug} page={p} onSave={save} onSaved={refetch} />
        ))}
      </div>
    </div>
  );
}

function PageEditor({ page, onSave, onSaved }: {
  page: { slug: string; title: string; effective_date: string; content: string; updated_at: string };
  onSave: ReturnType<typeof useServerFn<typeof updateLegalPage>>;
  onSaved: () => void;
}) {
  const [title, setTitle] = React.useState(page.title);
  const [date, setDate] = React.useState(page.effective_date.slice(0, 10));
  const [content, setContent] = React.useState(page.content);
  const [busy, setBusy] = React.useState(false);

  async function handleSave() {
    setBusy(true);
    try {
      await onSave({ data: { slug: page.slug, title, effective_date: date, content } });
      toast.success(`${title} saved`);
      onSaved();
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="neu-out rounded-3xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">/{page.slug}</p>
          <p className="text-xs text-[var(--ink-soft)] mt-1">Last updated: {new Date(page.updated_at).toLocaleString("en-ZA")}</p>
        </div>
        <Link to="/legal/$slug" params={{ slug: page.slug }} className="text-xs underline text-[var(--brand)]">View public page →</Link>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr]">
        <NeuField label="Title" required><NeuInput value={title} onChange={(e) => setTitle(e.target.value)} /></NeuField>
        <NeuField label="Effective date" required><NeuInput type="date" value={date} onChange={(e) => setDate(e.target.value)} /></NeuField>
      </div>
      <NeuField label="Content (markdown)" required>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          className="neu-in-sm w-full rounded-2xl px-4 py-3 text-sm font-mono bg-transparent text-[var(--ink)] focus:outline-none"
        />
      </NeuField>
      <div className="mt-4 flex justify-end">
        <NeuButton variant="lime" size="md" onClick={handleSave} disabled={busy}>
          {busy ? "Saving…" : "Save"}
        </NeuButton>
      </div>
    </div>
  );
}
