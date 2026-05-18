import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { listActiveTemplates } from "@/lib/content.functions";
import { NeuButton, NeuLinkButton } from "@/components/neu/NeuButton";
import { cart } from "@/lib/cart";
import { TEMPLATE_LICENCE } from "@/lib/licence";
import { Check, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Capacitiq" },
      { name: "description", content: "Plug-and-play Canva templates, SOPs, decks, and operating toolkits built for South African SMEs." },
      { property: "og:title", content: "Capacitiq Templates" },
      { property: "og:description", content: "Operating toolkits you can deploy today." },
      { property: "og:url", content: "/templates" },
    ],
    links: [{ rel: "canonical", href: "/templates" }],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const fetchTpls = useServerFn(listActiveTemplates);
  const { data, isLoading } = useQuery({ queryKey: ["templates"], queryFn: () => fetchTpls() });
  const [, force] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    const h = () => force();
    window.addEventListener("capacitiq.cart.changed", h);
    return () => window.removeEventListener("capacitiq.cart.changed", h);
  }, []);

  const inCart = (id: string) => cart.get().some((c) => c.id === id);
  const cartCount = cart.get().length;

  return (
    <div className="mx-auto max-w-7xl px-5">
      <section className="pt-12 md:pt-20 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Templates</p>
        <h1 className="mt-3 text-5xl md:text-6xl font-bold tracking-tight text-balance">Operating toolkits, ready to ship.</h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--ink-soft)]">
          Canva templates, decks, and SOPs you can deploy today. A Canva account is required.
        </p>
        {cartCount > 0 && (
          <div className="mt-6">
            <NeuLinkButton to="/templates/checkout" variant="lime" size="md">
              <ShoppingCart className="h-4 w-4" /> Checkout ({cartCount})
            </NeuLinkButton>
          </div>
        )}
      </section>

      <section className="pb-10">
        {isLoading && <p className="text-[var(--ink-soft)]">Loading…</p>}
        {!isLoading && (!data || data.length === 0) && (
          <div className="neu-out rounded-3xl p-12 text-center text-[var(--ink-soft)]">No templates available yet.</div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((t) => {
            const added = inCart(t.id);
            return (
              <article key={t.id} className="neu-out rounded-3xl p-5 flex flex-col">
                <Link to="/templates/$id" params={{ id: t.id }}>
                  {t.cover_image ? (
                    <div className="neu-in-sm rounded-2xl overflow-hidden aspect-[4/3]">
                      <img src={t.cover_image} alt={t.name} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="neu-in-sm rounded-2xl aspect-[4/3] flex items-center justify-center text-[var(--ink-soft)] text-sm">Preview</div>
                  )}
                </Link>
                {t.category && <span className="mt-4 inline-flex w-fit neu-pill px-3 py-1 text-xs">{t.category}</span>}
                <h3 className="mt-3 text-lg font-bold leading-snug"><Link to="/templates/$id" params={{ id: t.id }}>{t.name}</Link></h3>
                {t.description && <p className="mt-2 text-sm text-[var(--ink-soft)] line-clamp-2">{t.description}</p>}
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="font-bold text-lg">R{(t.price_cents / 100).toFixed(0)}</span>
                  <NeuButton
                    variant={added ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => {
                      if (added) { cart.remove(t.id); toast("Removed from cart"); }
                      else { cart.add({ id: t.id, name: t.name, price_cents: t.price_cents }); toast.success("Added to cart"); }
                    }}
                  >
                    {added ? <><Check className="h-4 w-4" /> In cart</> : "Add to cart"}
                  </NeuButton>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-12 mb-16 neu-out rounded-[2rem] p-8">
        <h2 className="text-xl font-bold mb-3">Licence</h2>
        <p className="text-sm text-[var(--ink-soft)] leading-relaxed whitespace-pre-line">{TEMPLATE_LICENCE}</p>
      </section>
    </div>
  );
}
