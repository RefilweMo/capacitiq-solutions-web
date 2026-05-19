import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Trash2, Plus } from "lucide-react";
import { NeuButton } from "@/components/neu/NeuButton";
import { NeuModal } from "@/components/neu/NeuModal";
import { toast } from "sonner";

export type AdminListProps<TRow> = {
  title: string;
  description?: string;
  queryKey: string;
  list: () => Promise<TRow[]>;
  upsert: (data: Partial<TRow>) => Promise<unknown>;
  remove: (data: { id: string }) => Promise<unknown>;
  rowTitle: (row: TRow) => string;
  rowSubtitle?: (row: TRow) => string;
  rowBadge?: (row: TRow) => { label: string; tone?: "ok" | "warn" } | null;
  emptyDefaults: Partial<TRow>;
  renderForm: (
    form: Partial<TRow>,
    update: (patch: Partial<TRow>) => void,
  ) => React.ReactNode;
};

export function AdminCrud<TRow extends { id?: string }>({
  title,
  description,
  queryKey,
  list,
  upsert,
  remove,
  rowTitle,
  rowSubtitle,
  rowBadge,
  emptyDefaults,
  renderForm,
}: AdminListProps<TRow>) {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: [queryKey], queryFn: list });
  const upsertM = useMutation({
    mutationFn: (d: Partial<TRow>) => upsert(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast.success("Saved"); setEditing(null); },
    onError: (e: any) => toast.error(e?.message ?? "Save failed"),
  });
  const deleteM = useMutation({
    mutationFn: (id: string) => remove({ id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e?.message ?? "Delete failed"),
  });

  const [editing, setEditing] = React.useState<Partial<TRow> | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-[var(--brand)]">{title}</h1>
          {description && <p className="mt-1 text-sm text-[var(--ink-soft)]">{description}</p>}
        </div>
        <NeuButton variant="lime" size="md" onClick={() => setEditing({ ...emptyDefaults })}>
          <Plus className="h-4 w-4" /> New
        </NeuButton>
      </div>

      {isLoading && <p className="text-[var(--ink-soft)]">Loading…</p>}
      {error && <p className="text-[var(--destructive)]">{(error as Error).message}</p>}

      <div className="space-y-3">
        {data?.map((row) => {
          const badge = rowBadge?.(row);
          return (
            <div key={row.id} className="neu-out rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-[var(--brand)] truncate">{rowTitle(row)}</p>
                  {badge && (
                    <span className={`neu-pill px-3 py-0.5 text-[10px] font-semibold ${badge.tone === "warn" ? "text-[var(--ink-soft)]" : "text-[var(--brand)]"}`}>
                      {badge.label}
                    </span>
                  )}
                </div>
                {rowSubtitle && <p className="text-xs text-[var(--ink-soft)] mt-1 truncate">{rowSubtitle(row)}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setEditing(row)} className="neu-out-sm h-9 w-9 rounded-full flex items-center justify-center text-[var(--brand)]" aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (!row.id) return;
                    if (confirm(`Delete "${rowTitle(row)}"? This cannot be undone.`)) deleteM.mutate(row.id as string);
                  }}
                  className="neu-out-sm h-9 w-9 rounded-full flex items-center justify-center text-[var(--destructive)]"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
        {data && data.length === 0 && (
          <div className="neu-out rounded-2xl p-10 text-center text-[var(--ink-soft)]">No items yet. Click New to add one.</div>
        )}
      </div>

      <NeuModal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? `Edit ${title.slice(0, -1) || title}` : `New ${title.slice(0, -1) || title}`} className="max-w-2xl">
        {editing && (
          <form
            onSubmit={(e) => { e.preventDefault(); upsertM.mutate(editing); }}
            className="space-y-4"
          >
            {renderForm(editing, (patch) => setEditing((cur) => ({ ...(cur ?? {}), ...patch })))}
            <div className="flex gap-3 pt-2">
              <NeuButton type="submit" variant="primary" size="md" disabled={upsertM.isPending} className="flex-1">
                {upsertM.isPending ? "Saving…" : "Save"}
              </NeuButton>
              <NeuButton type="button" variant="secondary" size="md" onClick={() => setEditing(null)}>Cancel</NeuButton>
            </div>
          </form>
        )}
      </NeuModal>
    </div>
  );
}

export function useServerFns() {
  return useServerFn;
}
