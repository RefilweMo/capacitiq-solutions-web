import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Sparkles, Zap, Target, MessageCircle } from "lucide-react";
import { NeuLinkButton, NeuButton } from "@/components/neu/NeuButton";
import { useModals } from "@/components/ModalsProvider";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "Capacitiq — Business Support for South African Startups & SMEs" },
      { name: "description", content: "We give startups and SMEs the operational structure they need to scale. Fractional ops, design, sales, and consulting from one B-BBEE Level 1 partner." },
      { property: "og:title", content: "Capacitiq — Build the business behind the business" },
      { property: "og:description", content: "Fractional ops, design, sales, and consulting for South African SMEs." },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Capacitiq",
        url: "https://capacitiq.co.za",
        email: "hello@capacitiq.co.za",
        sameAs: [
          "https://www.linkedin.com/company/capacitiq/",
          "https://www.instagram.com/capacitiq_za",
          "https://www.tiktok.com/@capacitiq",
        ],
      }),
    }],
  }),
  component: HomePage,
});

function HomePage() {
  const { openSpotter } = useModals();
  return (
    <div className="mx-auto max-w-7xl px-5">
      {/* Hero */}
      <section className="pt-12 md:pt-20 pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <div className="neu-pill inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[var(--ink-soft)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--brand)]" />
              B-BBEE Level 1 · Remote-first · South Africa
            </div>
            <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight text-balance">
              Build the business <span className="text-[var(--brand)]">behind the business.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--ink-soft)] text-balance">
              Capacitiq is the operational backbone for South African startups and SMEs. Fractional ops, design, sales, and consulting — delivered with the rigour your business deserves.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <NeuLinkButton to="/contact" variant="primary" size="lg">
                Book a discovery call <ArrowRight className="h-4 w-4" />
              </NeuLinkButton>
              <NeuLinkButton to="/services" variant="secondary" size="lg">See services</NeuLinkButton>
            </div>
          </div>
          <div className="relative">
            <div className="neu-out rounded-[2.5rem] p-8 md:p-10">
              <div className="grid gap-4">
                {[
                  { icon: Target, t: "Operations that scale", d: "SOPs, dashboards, and finance hygiene." },
                  { icon: Zap, t: "Design that converts", d: "Brand, decks, and digital that lands." },
                  { icon: CheckCircle2, t: "Sales that compound", d: "Pipelines, scripts, and outbound that works." },
                ].map((f) => (
                  <div key={f.t} className="neu-in-sm rounded-2xl p-4 flex items-start gap-4">
                    <div className="neu-out-sm h-11 w-11 rounded-full flex items-center justify-center shrink-0">
                      <f.icon className="h-5 w-5 text-[var(--brand)]" />
                    </div>
                    <div>
                      <p className="font-semibold">{f.t}</p>
                      <p className="text-sm text-[var(--ink-soft)]">{f.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spotter banner CTA */}
      <section className="my-12">
        <div className="neu-out rounded-[2rem] p-8 md:p-12 bg-[var(--brand)] text-[var(--brand-ink)] relative overflow-hidden">
          <div className="grid gap-6 md:grid-cols-[1.5fr_auto] items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--lime)]">Spotter Program</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-balance">Know a business that needs structure? Refer them. Earn commission.</h2>
              <p className="mt-3 text-sm md:text-base text-[var(--brand-ink)]/80 max-w-2xl">
                Anyone can be a Spotter. If your referral signs with us, you earn — no contract required.
              </p>
            </div>
            <NeuButton onClick={openSpotter} variant="lime" size="lg">
              Refer a business <ArrowRight className="h-4 w-4" />
            </NeuButton>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-16">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Capabilities</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">Six ways we plug in.</h2>
          </div>
          <Link to="/services" className="text-sm font-medium text-[var(--brand)] hover:underline">All services →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Operations", d: "SOPs, workflow design, project management. We make your business run without you watching it." },
            { t: "Sales", d: "Outbound systems, pipelines, scripts, CRM setup. Turn cold lists into a booked calendar." },
            { t: "Design", d: "Brand identity, decks, social, web. Visuals that make you look like the leader you are." },
            { t: "Consulting", d: "Strategy sessions and growth audits. Get unstuck and out of your own way." },
            { t: "Admin & Support", d: "Virtual assistants, inbox triage, scheduling. Free up the founder's calendar." },
            { t: "Templates", d: "Plug-and-play Canva templates, decks, and SOPs you can deploy today." },
          ].map((s) => (
            <div key={s.t} className="neu-out rounded-3xl p-7">
              <h3 className="text-xl font-bold">{s.t}</h3>
              <p className="mt-3 text-sm text-[var(--ink-soft)]">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="neu-out rounded-[2rem] p-10 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">Ready to operate with clarity?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--ink-soft)]">Tell us where you're stuck. We'll show you what to build next — no pitch, just clarity.</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <NeuLinkButton to="/contact" variant="primary" size="lg">Book a call</NeuLinkButton>
            <a href="https://wa.me/27640620354" target="_blank" rel="noopener noreferrer" className="neu-out inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium">
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
