import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPortfolio } from "@/lib/content.functions";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/_public/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Capacitiq" },
      { name: "description", content: "Operational systems, decks, brand work, and growth projects we've shipped for South African SMEs." },
      { property: "og:title", content: "Portfolio — Capacitiq" },
      { property: "og:description", content: "Selected client work." },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const fetchItems = useServerFn(listPortfolio);
  const { data, isLoading } = useQuery({ queryKey: ["portfolio"], queryFn: () => fetchItems() });
  return (
    <div className="mx-auto max-w-7xl px-5">
      <section className="pt-12 md:pt-20 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Portfolio</p>
        <h1 className="mt-3 text-5xl md:text-6xl font-bold tracking-tight text-balance">Selected work.</h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--ink-soft)]">A taste of what we ship — ops systems, decks, brand work, and growth projects.</p>
      </section>
      <section className="pb-16">
        {isLoading && <p className="text-[var(--ink-soft)]">Loading…</p>}
        {!isLoading && (!data || data.length === 0) && (
          <div className="neu-out rounded-3xl p-12 text-center">
            <p className="text-[var(--ink-soft)]">Case studies coming soon.</p>
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {data?.map((it) => (
            <article key={it.id} className="neu-out rounded-3xl p-6">
              {it.cover_image && (
                <div className="neu-in-sm rounded-2xl overflow-hidden mb-5 aspect-[16/10]">
                  <img src={it.cover_image} alt={it.title} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex items-center justify-between gap-3 text-xs text-[var(--ink-soft)] mb-2">
                {it.category && <span className="neu-pill px-3 py-1">{it.category}</span>}
                {it.client && <span>{it.client}</span>}
              </div>
              <h2 className="text-2xl font-bold">{it.title}</h2>
              {it.description && <p className="mt-3 text-sm text-[var(--ink-soft)]">{it.description}</p>}
              {it.url && (
                <a href={it.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--brand)]">
                  View project <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
