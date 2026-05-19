import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AdminCrud } from "@/components/admin/AdminCrud";
import { NeuInput, NeuTextarea, NeuField } from "@/components/neu/NeuInput";
import { listAllTemplates, upsertTemplate, deleteTemplate } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/templates")({
  head: () => ({ meta: [{ title: "Templates | Capacitiq Admin" }, { name: "robots", content: "noindex" }] }),
  component: TemplatesAdmin,
});

type Row = {
  id?: string;
  name: string;
  description?: string;
  price_cents: number;
  cover_image?: string;
  category?: string;
  canva_link: string;
  display_order?: number;
  active?: boolean;
};

function TemplatesAdmin() {
  const listFn = useServerFn(listAllTemplates);
  const upsertFn = useServerFn(upsertTemplate);
  const deleteFn = useServerFn(deleteTemplate);
  return (
    <AdminCrud<Row>
      title="Templates"
      description="Canva templates and toolkits. The Canva link is private and only emailed to buyers."
      queryKey="admin-templates"
      list={() => listFn() as Promise<Row[]>}
      upsert={(d) => upsertFn({ data: d as any })}
      remove={({ id }) => deleteFn({ data: { id } })}
      rowTitle={(r) => r.name}
      rowSubtitle={(r) => `R${(r.price_cents / 100).toFixed(0)}${r.category ? ` · ${r.category}` : ""}`}
      rowBadge={(r) => r.active ? { label: "Active" } : { label: "Inactive", tone: "warn" }}
      emptyDefaults={{ name: "", price_cents: 0, canva_link: "", display_order: 0, active: true }}
      renderForm={(f, u) => (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <NeuField label="Name" required><NeuInput value={f.name ?? ""} onChange={(e) => u({ name: e.target.value })} required maxLength={200} /></NeuField>
            <NeuField label="Category"><NeuInput value={f.category ?? ""} onChange={(e) => u({ category: e.target.value })} maxLength={80} /></NeuField>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <NeuField label="Price (ZAR)" required hint="In rands, whole numbers">
              <NeuInput type="number" min={0} step={1} value={(f.price_cents ?? 0) / 100} onChange={(e) => u({ price_cents: Math.round(Number(e.target.value) * 100) })} required />
            </NeuField>
            <NeuField label="Display order"><NeuInput type="number" value={f.display_order ?? 0} onChange={(e) => u({ display_order: Number(e.target.value) })} /></NeuField>
          </div>
          <NeuField label="Cover image URL"><NeuInput type="url" value={f.cover_image ?? ""} onChange={(e) => u({ cover_image: e.target.value })} placeholder="https://" /></NeuField>
          <NeuField label="Description"><NeuTextarea value={f.description ?? ""} onChange={(e) => u({ description: e.target.value })} maxLength={2000} /></NeuField>
          <NeuField label="Canva link (PRIVATE)" required hint="Sent to buyers after purchase. Never shown publicly.">
            <NeuInput type="url" value={f.canva_link ?? ""} onChange={(e) => u({ canva_link: e.target.value })} required placeholder="https://canva.com/design/..." />
          </NeuField>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!f.active} onChange={(e) => u({ active: e.target.checked })} />
            Active (visible in shop)
          </label>
        </>
      )}
    />
  );
}
