import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { Mail, MessageCircle, Instagram, Linkedin } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { NeuInput, NeuTextarea, NeuField } from "@/components/neu/NeuInput";
import { NeuButton } from "@/components/neu/NeuButton";
import { sendContactEmail } from "@/lib/forms.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Capacitiq" },
      { name: "description", content: "Ready to build a business that operates with clarity? Contact Capacitiq. We work with South African startups and SMEs." },
      { property: "og:title", content: "Contact Capacitiq" },
      { property: "og:description", content: "Book a discovery call or message us on WhatsApp." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const submit = useServerFn(sendContactEmail);
  const mut = useMutation({
    mutationFn: (data: Parameters<typeof submit>[0]["data"]) => submit({ data }),
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await mut.mutateAsync({
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        company: String(fd.get("company") || ""),
        message: String(fd.get("message") || ""),
      });
      toast.success("Thanks — we'll be in touch within one business day.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5">
      <section className="pt-12 md:pt-20 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Contact</p>
        <h1 className="mt-3 text-5xl md:text-6xl font-bold tracking-tight text-balance">Let's build the business behind your business.</h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--ink-soft)]">
          Tell us where you're stuck. We'll get back within one business day — usually faster.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr] pb-16">
        <form onSubmit={onSubmit} className="neu-out rounded-3xl p-8 md:p-10 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <NeuField label="Name" required><NeuInput name="name" required maxLength={120} /></NeuField>
            <NeuField label="Email" required><NeuInput type="email" name="email" required /></NeuField>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <NeuField label="Phone"><NeuInput name="phone" maxLength={40} /></NeuField>
            <NeuField label="Company"><NeuInput name="company" maxLength={160} /></NeuField>
          </div>
          <NeuField label="How can we help?" required>
            <NeuTextarea name="message" required minLength={5} maxLength={4000} placeholder="Tell us what you're trying to fix or build." />
          </NeuField>
          <NeuButton type="submit" variant="primary" size="lg" disabled={mut.isPending} className="w-full sm:w-auto">
            {mut.isPending ? "Sending…" : "Send message"}
          </NeuButton>
        </form>

        <aside className="neu-out rounded-3xl p-8 space-y-6">
          <div>
            <h3 className="font-bold text-lg">Other ways to reach us</h3>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">Prefer chat? Hit us up.</p>
          </div>
          <a href="https://wa.me/27640620354" target="_blank" rel="noopener noreferrer" className="neu-in-sm rounded-2xl p-4 flex items-center gap-3 hover:translate-x-1 transition-transform">
            <div className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center"><MessageCircle className="h-4 w-4 text-[var(--brand)]" /></div>
            <div>
              <p className="font-medium text-sm">WhatsApp</p>
              <p className="text-xs text-[var(--ink-soft)]">+27 64 062 0354</p>
            </div>
          </a>
          <a href="mailto:hello@capacitiq.co.za" className="neu-in-sm rounded-2xl p-4 flex items-center gap-3 hover:translate-x-1 transition-transform">
            <div className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center"><Mail className="h-4 w-4 text-[var(--brand)]" /></div>
            <div>
              <p className="font-medium text-sm">Email</p>
              <p className="text-xs text-[var(--ink-soft)]">hello@capacitiq.co.za</p>
            </div>
          </a>
          <div className="pt-4 border-t border-[var(--line)]/60">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-3">Follow</p>
            <div className="flex gap-3">
              <a aria-label="Instagram" href="https://www.instagram.com/capacitiq_za" target="_blank" rel="noopener noreferrer" className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center"><Instagram className="h-4 w-4" /></a>
              <a aria-label="LinkedIn" href="https://www.linkedin.com/company/capacitiq/" target="_blank" rel="noopener noreferrer" className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center"><Linkedin className="h-4 w-4" /></a>
              <a aria-label="TikTok" href="https://www.tiktok.com/@capacitiq" target="_blank" rel="noopener noreferrer" className="neu-out-sm h-10 w-10 rounded-full flex items-center justify-center"><TikTokIcon className="h-4 w-4" /></a>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
