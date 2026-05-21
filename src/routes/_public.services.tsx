import { createFileRoute, Link } from "@tanstack/react-router";
import { useModals } from "@/components/ModalsProvider";
import * as React from "react";

export const Route = createFileRoute("/_public/services")({
  head: () => ({
    meta: [
      { title: "Services — Capacitiq" },
      { name: "description", content: "Five integrated service pillars: Business Strategy & Operations, Marketing & Growth, Public Relations, Virtual Assistance, and Graphic Design." },
      { property: "og:title", content: "Capacitiq Services" },
      { property: "og:description", content: "Five integrated disciplines built for South African SMEs." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const LIME_BTN: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  background: "#e6ff2b",
  color: "#0b4650",
  boxShadow: "6px 6px 12px #c5cdd4, -6px -6px 12px #ffffff",
};

const PILLARS = [
  {
    id: "business-strategy", n: "01", t: "Business Strategy & Operations",
    tag: "Build the foundation. Create the systems. Lead with clarity.",
    body: "We help you move from instinct and improvisation to structured, documented, and intentional operations. We work with founders and leadership teams to identify operational gaps, build the systems that remove decision fatigue, and document how your business actually runs so it can scale without breaking.",
    deliverables: [
      "Operational diagnostic and gap analysis",
      "Process and workflow documentation",
      "Standard operating procedures",
      "Decision and escalation frameworks",
      "Quarterly review cadence",
    ],
  },
  {
    id: "marketing-growth", n: "02", t: "Marketing & Growth",
    tag: "Be seen. Be understood. Be chosen.",
    body: "We build positioning, systems, and campaigns that attract the right people and convert them. Marketing should not be a guessing game. We build positioning that is clear, content that is consistent, and systems that turn attention into qualified enquiries.",
    deliverables: [
      "Positioning and messaging architecture",
      "Content systems and editorial calendar",
      "Launch and campaign planning",
      "Funnel and conversion design",
      "Performance reporting cadence",
    ],
  },
  {
    id: "public-relations", n: "03", t: "Public Relations",
    tag: "Shape the narrative. Build the authority. Control the conversation.",
    body: "We focus on positioning, messaging, and communication strategy. PR at Capacitiq is about authority, not noise. We craft how your business is positioned in the market and how you communicate consistently across every touchpoint.",
    deliverables: [
      "Communication strategy",
      "Authority positioning framework",
      "Spokesperson and message training",
      "Stakeholder communication plans",
      "Crisis and response protocols",
    ],
  },
  {
    id: "virtual-assistance", n: "04", t: "Virtual Assistance",
    tag: "Stop doing everything. Start running a business.",
    body: "We take the operational load off your desk through proper systems and consistent execution support. Our virtual assistance is not freelance admin. It is structured execution support that integrates into your workflow so the operational load no longer sits on the founder's desk.",
    deliverables: [
      "Inbox and calendar management",
      "Scheduling and coordination",
      "Document and CRM upkeep",
      "Reporting and follow-up",
      "Process documentation as we go",
    ],
  },
  {
    id: "graphic-design", n: "05", t: "Graphic Design",
    tag: "Look like you mean business.",
    body: "Every visual we produce supports how your business positions itself, how it sells, and how it is remembered. We do not design for decoration. Every asset we produce is built to support how you communicate, sell, and operate. Brand-consistent and execution-ready.",
    deliverables: [
      "Sales and pitch decks",
      "Social and content templates",
      "Editable Canva systems",
      "Document and proposal templates",
      "Brand consistency guidelines",
    ],
  },
];

function ServicesPage() {
  const { openPricing } = useModals();

  return (
    <div className="mx-auto max-w-7xl px-5">
      {/* HERO */}
      <section className="pt-12 md:pt-20 pb-16">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4a6670]">Services</p>
        <h1 className="mt-3 text-5xl md:text-7xl font-bold tracking-tight text-balance text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
          Know what to expect before you commit.
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-[#4a6670]">
          Five integrated disciplines plus a fully managed web presence offering. Custom quotations are always available. You are never limited to what is listed.
        </p>
      </section>

      {/* PRICING GUIDE GATE */}
      <section className="pb-16">
        <div className="neu-out rounded-[2rem] p-8 md:p-12 grid gap-6 md:grid-cols-[1.5fr_auto] items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Pricing Guide</h2>
            <p className="mt-2 text-base font-medium text-[#0b4650]">Download the Pricing Guide.</p>
            <p className="mt-3 text-[#4a6670] max-w-2xl">
              Our pricing guide outlines how we structure our services, what is included, and how engagements are approached. Download it before reaching out so you can make an informed decision on what fits your business.
            </p>
          </div>
          <button onClick={openPricing} className="rounded-full px-7 py-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap" style={LIME_BTN}>
            Download Pricing Guide
          </button>
        </div>
      </section>

      {/* PILLARS */}
      {PILLARS.map((p, idx) => (
        <section key={p.id} id={p.id} className="py-16 scroll-mt-32">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] items-start">
            <div>
              <p className="text-6xl md:text-8xl font-bold text-[#0b4650]/20" style={{ fontFamily: "var(--font-display)" }}>{p.n}</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>{p.t}</h2>
              <p className="mt-4 text-base font-medium text-[#0b4650]">{p.tag}</p>
            </div>
            <div className="neu-out rounded-3xl p-8">
              <p className="text-[#4a6670] leading-relaxed">{p.body}</p>
              <h3 className="mt-7 text-sm font-bold uppercase tracking-wider text-[#0b4650]">Deliverables</h3>
              <ul className="mt-3 space-y-2">
                {p.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm text-[#4a6670]">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "#e6ff2b" }} />
                    {d}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="mt-7 inline-block rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider" style={LIME_BTN}>
                Apply This To Your Business
              </Link>
            </div>
          </div>
          {idx < PILLARS.length - 1 && <div className="mt-16 border-t border-[#c5cdd4]/60" />}
        </section>
      ))}

      {/* BOTTOM CTA */}
      <section className="py-20">
        <div className="neu-out rounded-[2rem] p-10 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
            Start structuring your business operations.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-[#4a6670]">
            Once reviewed, reach out with clarity on what fits your business.
          </p>
          <Link to="/contact" className="mt-8 inline-block rounded-full px-7 py-4 text-sm font-bold uppercase tracking-wider" style={LIME_BTN}>
            Apply This To Your Business
          </Link>
        </div>
      </section>
    </div>
  );
}
