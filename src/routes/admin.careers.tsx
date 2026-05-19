import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AdminCrud } from "@/components/admin/AdminCrud";
import { NeuInput, NeuTextarea, NeuField } from "@/components/neu/NeuInput";
import { listAllCareers, upsertCareer, deleteCareer } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/careers")({
  head: () => ({ meta: [{ title: "Careers | Capacitiq Admin" }, { name: "robots", content: "noindex" }] }),
  component: CareersAdmin,
});

type Row = {
  id?: string;
  title: string;
  location?: string;
  employment_type?: string;
  summary?: string;
  description?: string;
  requirements?: string;
  display_order?: number;
  open?: boolean;
};

function CareersAdmin() {
  const listFn = useServerFn(listAllCareers);
  const upsertFn = useServerFn(upsertCareer);
  const deleteFn = useServerFn(deleteCareer);
  return (
    <AdminCrud<Row>
      title="Careers"
      description="Open and closed role listings."
      queryKey="admin-careers"
      list={() => listFn() as Promise<Row[]>}
      upsert={(d) => upsertFn({ data: d as any })}
      remove={({ id }) => deleteFn({ data: { id } })}
      rowTitle={(r) => r.title}
      rowSubtitle={(r) => [r.location, r.employment_type].filter(Boolean).join(" · ")}
      rowBadge={(r) => r.open ? { label: "Open" } : { label: "Closed", tone: "warn" }}
      emptyDefaults={{ title: "", location: "Remote, South Africa", employment_type: "Contractor", display_order: 0, open: true }}
      renderForm={(f, u) => (
        <>
          <NeuField label="Title" required><NeuInput value={f.title ?? ""} onChange={(e) => u({ title: e.target.value })} required maxLength={200} /></NeuField>
          <div className="grid sm:grid-cols-2 gap-4">
            <NeuField label="Location"><NeuInput value={f.location ?? ""} onChange={(e) => u({ location: e.target.value })} maxLength={120} /></NeuField>
            <NeuField label="Employment type"><NeuInput value={f.employment_type ?? ""} onChange={(e) => u({ employment_type: e.target.value })} maxLength={80} /></NeuField>
          </div>
          <NeuField label="Summary"><NeuTextarea value={f.summary ?? ""} onChange={(e) => u({ summary: e.target.value })} maxLength={500} /></NeuField>
          <NeuField label="Description"><NeuTextarea value={f.description ?? ""} onChange={(e) => u({ description: e.target.value })} maxLength={8000} className="min-h-[180px]" /></NeuField>
          <NeuField label="Requirements"><NeuTextarea value={f.requirements ?? ""} onChange={(e) => u({ requirements: e.target.value })} maxLength={4000} /></NeuField>
          <NeuField label="Display order"><NeuInput type="number" value={f.display_order ?? 0} onChange={(e) => u({ display_order: Number(e.target.value) })} /></NeuField>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!f.open} onChange={(e) => u({ open: e.target.checked })} />
            Open (accepting applications)
          </label>
        </>
      )}
    />
  );
}
