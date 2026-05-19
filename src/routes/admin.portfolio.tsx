import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AdminCrud } from "@/components/admin/AdminCrud";
import { NeuInput, NeuTextarea, NeuField } from "@/components/neu/NeuInput";
import { listAllPortfolio, upsertPortfolio, deletePortfolio } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio | Capacitiq Admin" }, { name: "robots", content: "noindex" }] }),
  component: PortfolioAdmin,
});

type Row = {
  id?: string;
  title: string;
  client?: string;
  category?: string;
  description?: string;
  cover_image?: string;
  url?: string;
  tags?: string[];
  display_order?: number;
  published?: boolean;
};

function PortfolioAdmin() {
  const listFn = useServerFn(listAllPortfolio);
  const upsertFn = useServerFn(upsertPortfolio);
  const deleteFn = useServerFn(deletePortfolio);
  return (
    <AdminCrud<Row>
      title="Portfolio items"
      description="Case studies and project highlights."
      queryKey="admin-portfolio"
      list={() => listFn() as Promise<Row[]>}
      upsert={(d) => upsertFn({ data: d as any })}
      remove={({ id }) => deleteFn({ data: { id } })}
      rowTitle={(r) => r.title}
      rowSubtitle={(r) => [r.client, r.category].filter(Boolean).join(" · ")}
      rowBadge={(r) => r.published ? { label: "Published" } : { label: "Hidden", tone: "warn" }}
      emptyDefaults={{ title: "", display_order: 0, published: true, tags: [] }}
      renderForm={(f, u) => (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <NeuField label="Title" required><NeuInput value={f.title ?? ""} onChange={(e) => u({ title: e.target.value })} required maxLength={200} /></NeuField>
            <NeuField label="Client"><NeuInput value={f.client ?? ""} onChange={(e) => u({ client: e.target.value })} maxLength={200} /></NeuField>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <NeuField label="Category"><NeuInput value={f.category ?? ""} onChange={(e) => u({ category: e.target.value })} maxLength={80} /></NeuField>
            <NeuField label="Display order"><NeuInput type="number" value={f.display_order ?? 0} onChange={(e) => u({ display_order: Number(e.target.value) })} /></NeuField>
          </div>
          <NeuField label="Cover image URL"><NeuInput type="url" value={f.cover_image ?? ""} onChange={(e) => u({ cover_image: e.target.value })} placeholder="https://" /></NeuField>
          <NeuField label="Project URL"><NeuInput type="url" value={f.url ?? ""} onChange={(e) => u({ url: e.target.value })} placeholder="https://" /></NeuField>
          <NeuField label="Description"><NeuTextarea value={f.description ?? ""} onChange={(e) => u({ description: e.target.value })} maxLength={2000} /></NeuField>
          <NeuField label="Tags" hint="comma-separated"><NeuInput value={(f.tags ?? []).join(", ")} onChange={(e) => u({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} /></NeuField>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!f.published} onChange={(e) => u({ published: e.target.checked })} />
            Published
          </label>
        </>
      )}
    />
  );
}
