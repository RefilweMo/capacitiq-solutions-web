import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { cart, type CartItem } from "@/lib/cart";
import { sendTemplateOrder } from "@/lib/forms.functions";
import { NeuInput, NeuField } from "@/components/neu/NeuInput";
import { NeuButton, NeuLinkButton } from "@/components/neu/NeuButton";
import { TEMPLATE_LICENCE } from "@/lib/licence";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/templates/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Capacitiq Templates" },
      { name: "description", content: "Complete your Capacitiq template order. A Canva account is required to access your purchased templates." },
      { property: "og:url", content: "/templates/checkout" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/templates/checkout" }],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const submit = useServerFn(sendTemplateOrder);
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    setItems(cart.get());
    const h = () => setItems(cart.get());
    window.addEventListener("capacitiq.cart.changed", h);
    return () => window.removeEventListener("capacitiq.cart.changed", h);
  }, []);

  const total = items.reduce((s, i) => s + i.price_cents, 0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await submit({
        data: {
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          template_ids: items.map((i) => i.id),
        },
      });
      cart.clear();
      toast.success("Order received. Check your email for the download links.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Checkout</h1>

      {items.length === 0 ? (
        <div className="mt-10 neu-out rounded-3xl p-12 text-center">
          <p className="text-[var(--ink-soft)]">Your cart is empty.</p>
          <NeuLinkButton to="/templates" variant="primary" size="md" className="mt-5">Browse templates</NeuLinkButton>
        </div>
      ) : (
        <div className="mt-10 grid lg:grid-cols-[1.2fr_1fr] gap-8">
          <div className="neu-out rounded-3xl p-6 space-y-3">
            <h2 className="font-bold text-lg mb-2">Order summary</h2>
            {items.map((i) => (
              <div key={i.id} className="neu-in-sm rounded-2xl p-4 flex items-center justify-between gap-3">
                <span className="font-medium">{i.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold">R{(i.price_cents / 100).toFixed(0)}</span>
                  <button onClick={() => cart.remove(i.id)} aria-label="Remove" className="neu-out-sm h-9 w-9 rounded-full flex items-center justify-center">
                    <Trash2 className="h-4 w-4 text-[var(--ink-soft)]" />
                  </button>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-[var(--line)]/60 flex justify-between text-xl font-bold">
              <span>Total</span><span>R{(total / 100).toFixed(0)}</span>
            </div>
          </div>

          <form onSubmit={onSubmit} className="neu-out rounded-3xl p-6 space-y-5">
            <h2 className="font-bold text-lg">Your details</h2>
            <NeuField label="Full name" required><NeuInput name="name" required /></NeuField>
            <NeuField label="Email (we'll send the templates here)" required><NeuInput type="email" name="email" required /></NeuField>
            <p className="text-xs text-[var(--ink-soft)]">A Canva account is required to access your templates.</p>
            <NeuButton type="submit" variant="lime" size="lg" disabled={busy} className="w-full">
              {busy ? "Processing…" : `Complete order · R${(total / 100).toFixed(0)}`}
            </NeuButton>
          </form>
        </div>
      )}

      <section className="mt-12 neu-out rounded-3xl p-8">
        <h2 className="text-xl font-bold mb-3">Licence</h2>
        <p className="text-sm text-[var(--ink-soft)] leading-relaxed whitespace-pre-line">{TEMPLATE_LICENCE}</p>
      </section>

      <p className="mt-6 text-sm">
        <Link to="/templates" className="text-[var(--brand)] underline">Keep browsing templates</Link>
      </p>
    </div>
  );
}
