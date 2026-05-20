import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, TrendingUp, Megaphone, Briefcase, PenTool, ChevronRight } from "lucide-react";
import { useModals } from "@/components/ModalsProvider";
import { NeuAccordion } from "@/components/neu/NeuAccordion";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "Capacitiq — Build a business that operates with clarity and structure" },
      { name: "description", content: "Capacitiq is a consulting, design, PR, and virtual assistance agency helping startups and SMEs build the systems, strategy, and execution support they need to grow with intention." },
      { property: "og:title", content: "Capacitiq — Build a business that operates with clarity and structure" },
      { property: "og:description", content: "Consulting, design, PR, and virtual assistance for South African SMEs." },
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

const LIME_BTN: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  background: "#e6ff2b",
  color: "#0b4650",
  boxShadow: "6px 6px 12px #c5cdd4, -6px -6px 12px #ffffff",
};

const SERVICES = [
  { n: "01", Icon: Compass, t: "Business Strategy & Operations", d: "Build the foundation. Create the systems. Lead with clarity. We help you move from instinct and improvisation to structured, documented, and intentional operations.", hash: "business-strategy" },
  { n: "02", Icon: TrendingUp, t: "Marketing & Growth", d: "Be seen. Be understood. Be chosen. We build positioning, systems, and campaigns that attract the right people and convert them.", hash: "marketing-growth" },
  { n: "03", Icon: Megaphone, t: "Public Relations", d: "Shape the narrative. Build the authority. Control the conversation. We focus on positioning, messaging, and communication strategy.", hash: "public-relations" },
  { n: "04", Icon: Briefcase, t: "Virtual Assistance", d: "Stop doing everything. Start running a business. We take the operational load off your desk through proper systems and consistent execution support.", hash: "virtual-assistance" },
  { n: "05", Icon: PenTool, t: "Graphic Design", d: "Look like you mean business. Every visual we produce supports how your business positions itself, how it sells, and how it is remembered.", hash: "graphic-design" },
];

const TABLE = [
  ["Deliver output and move on", "Deliver output and document how it works"],
  ["Charge by the hour and expand scope quietly", "Fixed packages with defined deliverables and no surprises"],
  ["Work in isolation from your business goals", "Every service is connected to a broader business outcome"],
  ["Offer one or two disciplines", "Six integrated pillars so you do not need six vendors"],
  ["You own the work but not the thinking behind it", "You own everything including the work, the thinking, and the systems"],
];

const STEPS = [
  { n: "Step 1", t: "Entry: Ignite", d: "Test the partnership, solve one specific problem, or get clarity before committing to a larger scope." },
  { n: "Step 2", t: "Mid-tier Project", d: "A defined business challenge that needs proper attention." },
  { n: "Step 3", t: "Senior Project", d: "Complex or multi-session engagements requiring deep diagnostic work and strategic depth." },
  { n: "Step 4", t: "Monthly Retainer", d: "Ongoing support with consistent output scaling to full fractional support." },
];

const FAQS = [
  { q: "How do your services work in practice?", a: "We start with a discovery session to understand your business — how it operates, where the gaps are, and what outcomes you need. From there we scope a focused engagement, agree on deliverables, and work through implementation together. You are never handed a document and left to figure it out alone." },
  { q: "Do you offer once-off services or ongoing support?", a: "Both. Our pricing structure moves from once-off entry and project engagements to monthly retainers. You can start with a single focused project and move into ongoing support once the relationship is established." },
  { q: "Is this suitable for early stage businesses?", a: "Yes. Many of our clients are past the idea stage but have not yet formalised how they operate. If you are generating revenue but running on instinct, this is exactly the stage where structured support creates the most impact." },
  { q: "Do you create logos or video content?", a: "We create logos as part of our Graphic Design pillar. Video content is not a current service offering. We focus on static and document-based visual assets that support business positioning and execution." },
  { q: "Do you handle media placements or press coverage?", a: "Our PR work focuses on positioning, messaging strategy, stakeholder communication, and authority building rather than paid media placement. We build the narrative infrastructure your business needs to earn coverage organically." },
  { q: "How long does a project take?", a: "Entry-level engagements are typically completed within one to two weeks. Mid-tier projects run two to four weeks. Senior and multi-session projects are scoped individually. Retainers operate on a monthly cadence with agreed deliverables per cycle." },
  { q: "What do you need from us to get started?", a: "Clarity on what you are trying to solve and willingness to engage in the process. We send a short onboarding brief before any engagement begins so we can prepare properly. You do not need a polished brief — just an honest one." },
  { q: "Will you manage everything for us?", a: "We are not a management company. We integrate into your workflow, build the systems, and support execution — but the business remains yours to lead. Our goal is to leave you with something you can operate independently, not to create dependency on us." },
];

function HomePage() {
  const { openSpotter } = useModals();

  return (
    <div className="mx-auto max-w-7xl px-5">
      {/* HERO */}
      <section className="pt-12 md:pt-20 pb-16">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
            Build a business that operates with clarity and structure.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[#4a6670] text-balance">
            Capacitiq is a consulting, design, PR, and virtual assistance agency helping startups and SMEs build the systems, strategy, and execution support they need to grow with intention.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/contact" className="rounded-full px-7 py-4 text-sm font-bold uppercase tracking-wider" style={LIME_BTN}>
              Work With Us
            </Link>
            <Link
              to="/services"
              className="neu-out rounded-full px-7 py-4 text-sm font-medium text-[#0b4650]"
            >
              See how this works in practice
            </Link>
          </div>
        </div>
      </section>

      {/* SPOTTERS (dark teal) */}
      <section className="my-12">
        <div
          className="rounded-[2rem] p-8 md:p-12 relative overflow-hidden"
          style={{ background: "#0b4650", boxShadow: "8px 8px 16px #c5cdd4, -8px -8px 16px #ffffff" }}
        >
          <div className="grid gap-6 md:grid-cols-[1.5fr_auto] items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#e6ff2b" }}>
                Spotter Program
              </p>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold text-balance text-white" style={{ fontFamily: "var(--font-display)" }}>
                Turn your network into income.
              </h2>
              <p className="mt-4 text-base md:text-lg text-white/90">
                Refer a business to Capacitiq and earn 15% of their first invoice.
              </p>
            </div>
            <button
              onClick={openSpotter}
              className="rounded-full px-7 py-4 text-sm font-bold uppercase tracking-wider"
              style={LIME_BTN}
            >
              Become a Spotter
            </button>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-16">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4a6670]">Capabilities</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
            One relationship. Full-service delivery.
          </h2>
          <p className="mt-5 text-base text-[#4a6670]">
            We are a multidisciplinary business support agency. Across five service pillars and a fully managed web presence offering, we provide the strategy, systems, execution support, and creative output that small businesses need to function properly and grow with intention. You do not need five vendors. You need one partner who understands the full picture.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={s.n} className="neu-out rounded-3xl p-7 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="neu-out-sm h-12 w-12 rounded-full flex items-center justify-center text-[#0b4650]">
                  <s.Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-[#4a6670]">{s.n}</span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
                {s.t}
              </h3>
              <p className="mt-3 text-sm text-[#4a6670] flex-1">{s.d}</p>
              <Link to="/services" hash={s.hash} className="mt-5 text-sm font-medium text-[#0b4650] hover:underline">
                See how this works in practice →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* DIFFERENCE TABLE */}
      <section className="py-16">
        <div className="max-w-3xl mb-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
            The Capacitiq Difference
          </h2>
          <p className="mt-5 text-base text-[#4a6670]">
            There is no shortage of people who will take your brief and produce something. What is rare is a partner who thinks before they produce, documents what they build, and leaves you with something that works after they are gone.
          </p>
        </div>

        <div className="neu-out rounded-3xl overflow-hidden">
          <div className="grid grid-cols-2" style={{ background: "#0b4650" }}>
            <div className="p-5 text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              Most Agencies or Freelancers
            </div>
            <div className="p-5 text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              Capacitiq
            </div>
          </div>
          {TABLE.map(([a, b], i) => (
            <div key={i} className="grid grid-cols-2 border-t border-[#c5cdd4]/60">
              <div className="p-5 text-sm text-[#4a6670]">{a}</div>
              <div className="p-5 text-sm text-[#0b4650] font-medium">{b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING LADDER */}
      <section className="py-16">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4a6670]">How Our Pricing Works</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
            A Ladder of Value. Start anywhere.
          </h2>
          <p className="mt-5 text-base text-[#4a6670]">
            Every pillar follows a clear structure from a focused entry package to full fractional or agency-level support. You can start at any point.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-4">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="neu-out rounded-3xl p-6 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#4a6670]">{s.n}</p>
                <h3 className="mt-2 text-xl font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>{s.t}</h3>
                <p className="mt-3 text-sm text-[#4a6670]">{s.d}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:flex items-center justify-center text-[#0b4650]">
                  <ChevronRight className="h-6 w-6" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4a6670]">FAQ</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
            Questions you may already have before reaching out.
          </h2>
        </div>
        <NeuAccordion items={FAQS.map((f) => ({ q: f.q, a: f.a }))} />
      </section>

      {/* FINAL CTA */}
      <section className="py-16">
        <div className="neu-out rounded-[2rem] p-10 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
            Build a business that runs with intention.
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-base text-[#4a6670]">
            If your business is ready to move from reactive operations to structured execution, this is where the shift begins.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/contact" className="rounded-full px-7 py-4 text-sm font-bold uppercase tracking-wider" style={LIME_BTN}>
              Work With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import * as React from "react";
