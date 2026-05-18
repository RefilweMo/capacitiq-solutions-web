import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import * as React from "react";
import { getTemplate } from "@/lib/content.functions";
import { NeuButton, NeuLinkButton } from "@/components/neu/NeuButton";
import { cart } from "@/lib/cart";
import { ArrowLeft, Check, ShoppingCart } from "lucide-react";
import { TEMPLATE_LICENCE } from "@/lib/licence";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/templates/$id")({
  loader: async ({ params }) => {
    const t = await getTemplate({ data: { id: params.id } });
    if (!t) throw notFound();
    return { t };
  },
  head: ({ loaderData }) => {
    const t = loaderData?.t;
    return {
      meta: [
        { title: t ? `${t.name} — Capacitiq Templates` : "Template" },
        { name: "description", content: t?.description ?? "Capacitiq template" },
        { property: "og:title", content: t?.name ?? "" },
        { property: "og:description", content: t?.description ?? "" },
        { property: "og:type", content: "product" },
        ...(t?.cover_image ? [{ property: "og:image" as const, content: t.cover_image }] : []),
      ],
      links: t ? [{ rel: "canonical", href: `/templates/${t.id}` }] : [],
    };
  },
  component: TemplatePage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="text-3xl font-bold">Template not found</h1>
      <Link to="/templates" className="mt-4 inline-block text-[var(--brand)] underline">Back to templates</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-12 text-center">{error.message}</div>,
});

function TemplatePage() {
  const { t } = Route.useLoaderData();
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const h = () => force();
    window.addEventListener("capacitiq.cart.changed", h);
    return () => window.removeEventListener("capacitiq.cart.changed", h);
  }, []);
  const added = cart.get().some((c) => c.id === t.id);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Link to="/templates" className="inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] mb-6">
        <ArrowLeft className="h-4 w-4" /> All templates
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="neu-out rounded-3xl p-4">
          {t.cover_image ? (
            <img src={t.cover_image} alt={t.name} className="rounded-2xl w-full aspect-[4/3] object-cover" />
          ) : (
            <div className="rounded-2xl aspect-[4/3] neu-in-sm flex items-center justify-center text-[var(--ink-soft)]">Preview</div>
          )}
        </div>
        <div>
          {t.category && <span className="neu-pill inline-block px-3 py-1 text-xs">{t.category}</span>}
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">{t.name}</h1>
          {t.description && <p className="mt-4 text-[var(--ink-soft)] leading-relaxed">{t.description}</p>}
          <p className="mt-6 text-3xl font-bold">R{(t.price_cents / 100).toFixed(0)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <NeuButton
              variant={added ? "secondary" : "primary"}
              size="lg"
              onClick={() => {
                if (added) { cart.remove(t.id); toast("Removed from cart"); }
                else { cart.add({ id: t.id, name: t.name, price_cents: t.price_cents }); toast.success("Added to cart"); }
              }}
            >
              {added ? <><Check className="h-4 w-4" /> In cart</> : <><ShoppingCart className="h-4 w-4" /> Add to cart</>}
            </NeuButton>
            <NeuLinkButton to="/templates/checkout" variant="lime" size="lg">Checkout</NeuLinkButton>
          </div>
          <p className="mt-6 text-xs text-[var(--ink-soft)]">A Canva account is required to use this template.</p>
        </div>
      </div>
      <section className="mt-12 neu-out rounded-3xl p-8">
        <h2 className="text-xl font-bold mb-3">Licence</h2>
        <p className="text-sm text-[var(--ink-soft)] leading-relaxed whitespace-pre-line">{TEMPLATE_LICENCE}</p>
      </section>
    </div>
  );
}
