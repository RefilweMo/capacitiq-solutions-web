import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import * as React from "react";
import { NeuAccordion } from "@/components/neu/NeuAccordion";

export const Route = createFileRoute("/_public/company")({
  head: () => ({
    meta: [
      { title: "Company — Capacitiq Solutions" },
      { name: "description", content: "Capacitiq Solutions (Pty) Ltd. B-BBEE Level 1. Registration 2026/344156/07. Building businesses that operate with clarity and structure." },
      { property: "og:title", content: "Company — Capacitiq Solutions" },
      { property: "og:description", content: "Capacitiq Solutions (Pty) Ltd. B-BBEE Level 1 Contributor." },
      { property: "og:url", content: "/company" },
    ],
    links: [{ rel: "canonical", href: "/company" }],
  }),
  component: CompanyPage,
});

const LIME_BTN: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  background: "#e6ff2b",
  color: "#0b4650",
  boxShadow: "6px 6px 12px #c5cdd4, -6px -6px 12px #ffffff",
};

const WHY = [
  { t: "Who We Work With", d: "We work with businesses that are actively growing. Our clients are usually past the idea stage, but struggling with systems, consistency, or direction." },
  { t: "What We Combine", d: "We combine strategy and execution support. From consulting to design to operational assistance, we help your business not just plan, but implement." },
  { t: "How We Operate", d: "We operate as an extension of your business. We do not work like an external agency. We integrate into your systems and improve how things function internally. We prioritise clarity, structure, and scalability." },
];

const STEPS = [
  { n: "Step 1", t: "Understand", d: "We begin by understanding how your business currently operates, how decisions are made, and where inconsistencies exist. This allows us to identify gaps in structure, communication, and execution." },
  { n: "Step 2", t: "Define", d: "Once clarity is established, we define a focused approach that aligns your operations with your growth stage. This includes refining how your business communicates, how tasks are managed, and how systems support daily activity." },
  { n: "Step 3", t: "Implement", d: "From there, we move into implementation. We do not stop at recommendations. We support the execution of systems, processes, and assets required to create consistency and control." },
  { n: "Step 4", t: "Integrate", d: "Throughout the process, we integrate into your workflow where necessary, ensuring that what is built is practical, usable, and sustainable within your business." },
  { n: "Step 5", t: "Outcome", d: "The outcome is a business that operates with structure, communicates with clarity, and executes with consistency." },
];

const FAQS = [
  { q: "Why focus on systems before growth?", a: "Activity without structure produces inconsistency, and inconsistency is what most growing businesses are actually struggling with. We believe that building the operating system first allows every additional resource, team member, or campaign to sit on something stable. Scale without systems creates chaos. Systems create the conditions for scale to work." },
  { q: "What makes your approach different?", a: "We do not separate strategy from execution. Most agencies advise or deliver, but rarely do both. At Capacitiq, we think before we produce, we document what we build, and we leave you with something you can run without us. Every service is connected to a broader business outcome, not delivered in isolation." },
  { q: "Who do you work best with?", a: "Businesses that are past the idea stage but have not yet formalised how they operate. Typically founders generating revenue but running on instinct, with no documented processes, inconsistent output, or no clear positioning in the market." },
  { q: "Will you manage everything for us?", a: "No. We are not a management company or outsourced operations team. We build the systems, support the execution, and document the processes — but you remain the operator. Our goal is to leave your business more capable, not more dependent." },
  { q: "What happens after the project is complete?", a: "Every engagement ends with a handover. You receive all assets, documentation, and access. If you move into a retainer, we continue the support on an ongoing basis. If not, you have everything you need to continue independently." },
  { q: "Is this suitable for early stage businesses?", a: "Yes. If you are generating any form of revenue and operating without systems, structure, or consistent output, there is value to be unlocked immediately. You do not need to be established to benefit from clarity." },
];

function CompanyPage() {
  return (
    <div className="mx-auto max-w-7xl px-5">
      {/* HERO */}
      <section className="pt-12 md:pt-20 pb-16">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4a6670]">Company</p>
        <h1 className="mt-3 text-5xl md:text-7xl font-bold tracking-tight text-balance text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
          Build a business that operates with clarity and structure.
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-[#4a6670]">
          Capacitiq Solutions (Pty) Ltd, trading as Capacitiq. Registered in South Africa. B-BBEE Level 1 Contributor. Registration No. 2026/344156/07. Operating remotely across the country.
        </p>
      </section>

      {/* WHY */}
      <section className="py-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
          Why businesses choose structured execution over guesswork
        </h2>
        <p className="mt-5 max-w-3xl text-[#4a6670]">
          We build structure, not just visuals or content. We focus on how businesses operate, communicate, and grow, not just how they look online.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {WHY.map((w) => (
            <div key={w.t} className="neu-out rounded-3xl p-7">
              <h3 className="text-xl font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>{w.t}</h3>
              <p className="mt-3 text-sm text-[#4a6670] leading-relaxed">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="py-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Our Philosophy</h2>
        <p className="mt-3 text-base font-medium text-[#0b4650]">What drives how we think and operate.</p>
        <div className="mt-8 space-y-4 max-w-3xl">
          <p className="text-[#4a6670] leading-relaxed">
            Capacitiq operates on a straightforward premise: businesses fail not because of lack of ideas, but because of lack of structure, clarity, and execution systems. We believe that growth without operational alignment creates instability, not success, which is why we prioritise building systems before scaling activity.
          </p>
          <p className="text-[#4a6670] leading-relaxed">
            Our work is grounded in creating clarity where there is confusion, consistency where there is inconsistency, and functional structure where businesses are operating on intuition rather than process.
          </p>
          <p className="text-[#4a6670] leading-relaxed">
            We do not see ourselves as traditional service providers, but as builders of internal capability that allows businesses to operate, communicate, and scale with intention rather than chaos.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="neu-out rounded-3xl p-7">
            <p className="text-xs font-bold uppercase tracking-wider text-[#4a6670]">Vision</p>
            <h3 className="mt-2 text-2xl font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Where we are building towards.</h3>
            <p className="mt-3 text-[#4a6670] leading-relaxed">
              To become a leading business systems and execution partner for startups and SMEs across South Africa, known for transforming disorganised businesses into structured, scalable, and high-performing operations.
            </p>
          </div>
          <div className="neu-out rounded-3xl p-7">
            <p className="text-xs font-bold uppercase tracking-wider text-[#4a6670]">Mission</p>
            <h3 className="mt-2 text-2xl font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>What guides how we deliver our work.</h3>
            <p className="mt-3 text-[#4a6670] leading-relaxed">
              To help businesses grow through clarity, structure, and execution support by combining strategy, systems, and service delivery into one integrated solution that enables sustainable and scalable growth.
            </p>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="py-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>How We Work</h2>
        <div className="mt-10 flex flex-col lg:flex-row items-stretch gap-3">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="neu-out rounded-3xl p-6 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#4a6670]">{s.n}</p>
                <h3 className="mt-2 text-xl font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>{s.t}</h3>
                <p className="mt-3 text-sm text-[#4a6670] leading-relaxed">{s.d}</p>
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
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Company FAQ</h2>
        <div className="mt-8">
          <NeuAccordion items={FAQS} />
        </div>
      </section>

      {/* COMPLIANCE */}
      <section className="py-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>
          Registered, compliant, and verified.
        </h2>
        <p className="mt-5 max-w-3xl text-[#4a6670]">
          Capacitiq Solutions (Pty) Ltd is a registered private company in South Africa. We are a verified B-BBEE Level 1 Contributor, which means engaging Capacitiq supports your own B-BBEE procurement scorecard. Our registration number is 2026/344156/07.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 max-w-3xl">
          <div className="neu-out rounded-3xl p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#4a6670]">Empowerment</p>
            <p className="mt-2 text-xl font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>B-BBEE Level 1 Contributor</p>
          </div>
          <div className="neu-out rounded-3xl p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#4a6670]">CIPC</p>
            <p className="mt-2 text-xl font-bold text-[#0b4650]" style={{ fontFamily: "var(--font-display)" }}>Registration No. 2026/344156/07</p>
          </div>
        </div>
        <div className="mt-10">
          <Link to="/contact" className="inline-block rounded-full px-7 py-4 text-sm font-bold uppercase tracking-wider" style={LIME_BTN}>
            Work With Us
          </Link>
        </div>
      </section>
    </div>
  );
}
