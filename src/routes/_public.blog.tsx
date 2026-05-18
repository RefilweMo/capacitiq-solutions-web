import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPublishedPosts } from "@/lib/content.functions";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/_public/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Capacitiq" },
      { name: "description", content: "Insights, playbooks, and lessons on building operationally sound businesses in South Africa." },
      { property: "og:title", content: "Capacitiq Blog" },
      { property: "og:description", content: "Playbooks for SA startups and SMEs." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const fetchPosts = useServerFn(listPublishedPosts);
  const { data, isLoading } = useQuery({ queryKey: ["posts"], queryFn: () => fetchPosts() });

  return (
    <div className="mx-auto max-w-7xl px-5">
      <section className="pt-12 md:pt-20 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Blog</p>
        <h1 className="mt-3 text-5xl md:text-6xl font-bold tracking-tight text-balance">Playbooks for builders.</h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--ink-soft)]">
          Field notes on operations, growth, and the boring stuff that actually moves the needle.
        </p>
      </section>

      <section className="pb-16">
        {isLoading && <p className="text-[var(--ink-soft)]">Loading…</p>}
        {!isLoading && (!data || data.length === 0) && (
          <div className="neu-out rounded-3xl p-12 text-center">
            <p className="text-[var(--ink-soft)]">No posts yet. Subscribe on socials — we publish weekly.</p>
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="neu-out rounded-3xl p-6 group hover:translate-y-[-2px] transition-transform"
            >
              {p.cover_image && (
                <div className="neu-in-sm rounded-2xl overflow-hidden mb-4 aspect-[16/10]">
                  <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex items-center justify-between gap-3 mb-3 text-xs text-[var(--ink-soft)]">
                <span>{p.author}</span>
                {p.published_at && <span>{new Date(p.published_at).toLocaleDateString("en-ZA", { dateStyle: "medium" })}</span>}
              </div>
              <h2 className="text-xl font-bold leading-snug group-hover:text-[var(--brand)]">{p.title}</h2>
              {p.excerpt && <p className="mt-3 text-sm text-[var(--ink-soft)] line-clamp-3">{p.excerpt}</p>}
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--brand)]">
                Read <ArrowUpRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
