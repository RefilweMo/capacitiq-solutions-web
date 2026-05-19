import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AdminCrud } from "@/components/admin/AdminCrud";
import { NeuInput, NeuTextarea, NeuField } from "@/components/neu/NeuInput";
import { listAllBlog, upsertBlog, deleteBlog } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/blog")({
  head: () => ({ meta: [{ title: "Blog | Capacitiq Admin" }, { name: "robots", content: "noindex" }] }),
  component: BlogAdmin,
});

type Row = {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  author?: string;
  tags?: string[];
  published?: boolean;
};

function BlogAdmin() {
  const listFn = useServerFn(listAllBlog);
  const upsertFn = useServerFn(upsertBlog);
  const deleteFn = useServerFn(deleteBlog);
  return (
    <AdminCrud<Row>
      title="Blog posts"
      description="Create, edit, and publish posts."
      queryKey="admin-blog"
      list={() => listFn() as Promise<Row[]>}
      upsert={(d) => upsertFn({ data: d as any })}
      remove={({ id }) => deleteFn({ data: { id } })}
      rowTitle={(r) => r.title}
      rowSubtitle={(r) => `/${r.slug}`}
      rowBadge={(r) => r.published ? { label: "Published" } : { label: "Draft", tone: "warn" }}
      emptyDefaults={{ slug: "", title: "", content: "", author: "Capacitiq", tags: [], published: false }}
      renderForm={(f, u) => (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <NeuField label="Title" required><NeuInput value={f.title ?? ""} onChange={(e) => u({ title: e.target.value })} required maxLength={300} /></NeuField>
            <NeuField label="Slug" required hint="kebab-case, no spaces"><NeuInput value={f.slug ?? ""} onChange={(e) => u({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} required maxLength={200} pattern="^[a-z0-9-]+$" /></NeuField>
          </div>
          <NeuField label="Excerpt"><NeuTextarea value={f.excerpt ?? ""} onChange={(e) => u({ excerpt: e.target.value })} maxLength={500} /></NeuField>
          <NeuField label="Cover image URL"><NeuInput type="url" value={f.cover_image ?? ""} onChange={(e) => u({ cover_image: e.target.value })} placeholder="https://" /></NeuField>
          <div className="grid sm:grid-cols-2 gap-4">
            <NeuField label="Author"><NeuInput value={f.author ?? "Capacitiq"} onChange={(e) => u({ author: e.target.value })} /></NeuField>
            <NeuField label="Tags" hint="comma-separated"><NeuInput value={(f.tags ?? []).join(", ")} onChange={(e) => u({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} /></NeuField>
          </div>
          <NeuField label="Content (Markdown or plain text)" required>
            <NeuTextarea value={f.content ?? ""} onChange={(e) => u({ content: e.target.value })} required className="min-h-[260px]" />
          </NeuField>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!f.published} onChange={(e) => u({ published: e.target.checked })} />
            Published
          </label>
        </>
      )}
    />
  );
}
