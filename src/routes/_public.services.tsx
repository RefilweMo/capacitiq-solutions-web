import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { NeuLinkButton, NeuButton } from "@/components/neu/NeuButton";
import { useModals } from "@/components/ModalsProvider";

export const Route = createFileRoute("/_public/services")({
  head: () => ({
    meta: [
      { title: "Services — Capacitiq" },
      { name: "description", content: "Operations, sales, design, consulting, admin support, and templates. Fractional capacity for South African startups and SMEs." },
      { property: "og:title", content: "Services — Capacitiq" },
      { property: "og:description", content: "Six ways Capacitiq plugs into your business." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const SERVICES = [
  {
    t: "Operations",
    d: "Standard operating procedures, workflow design, project management, and the systems that let your team run without you watching.",
    bullets: ["SOP authoring & rollout", "Project management setup (ClickUp/Notion/Asana)", "Dashboards & reporting", "Process automation"],
  },
  {
    t: "Sales & Growth",
    d: "Outbound systems, CRM hygiene, sales scripts, and lead-gen pipelines that turn cold lists into a full calendar.",
    bullets: ["CRM setup & migration", "Outbound playbooks", "Sales script writing", "Pipeline & conversion tracking"],
  },
  {
    t: "Design & Brand",
    d: "Identity, decks, social, and web design that makes you look like the category leader you're trying to become.",
    bullets: ["Brand identity systems", "Investor & sales decks", "Social content design", "Landing page design"],
  },
  {
    t: "Consulting",
    d: "Strategy sessions, growth audits, and operating model reviews. Get unstuck — and stop guessing what to fix first.",
    bullets: ["Growth audits", "Operating model reviews", "Pricing & packaging strategy", "Quarterly planning facilitation"],
  },
  {
    t: "Admin & Support",
    d: "Virtual assistants, inbox triage, scheduling, vendor management. Free the founder to do founder work.",
    bullets: ["Inbox & calendar management", "Vendor & procurement support", "Document control", "Travel & event coordination"],
  },
  {
    t: "Templates & Toolkits",
    d: "Plug-and-play Canva templates, SOP libraries, and operating playbooks you can deploy today.",
    bullets: ["Canva template library", "SOP & policy templates", "Sales asset packs", "Investor-ready decks"],
  },
];

function ServicesPage() {
  const { openPricing } = useModals();
  return (
    <div className="mx-auto max-w-7xl px-5">
      <section className="pt-12 md:pt-20 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Services</p>
        <h1 className="mt-3 text-5xl md:text-6xl font-bold tracking-tight text-balance">Fractional capacity, full-time clarity.</h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--ink-soft)]">
          We embed where you need us, build what's missing, and hand back a business that operates with discipline. Pick a service or stitch several together.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 pb-12">
        {SERVICES.map((s) => (
          <article key={s.t} className="neu-out rounded-3xl p-8">
            <h2 className="text-2xl font-bold">{s.t}</h2>
            <p className="mt-3 text-sm text-[var(--ink-soft)]">{s.d}</p>
            <ul className="mt-5 space-y-2">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-[var(--brand)] shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="my-16 neu-out rounded-[2rem] p-10 md:p-14">
        <div className="grid md:grid-cols-[1.4fr_auto] items-center gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Want the full pricing breakdown?</h2>
            <p className="mt-3 text-[var(--ink-soft)]">Download the Capacitiq Pricing Guide — retainers, projects, and packages explained.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <NeuButton onClick={openPricing} variant="lime" size="lg">Get the pricing guide</NeuButton>
            <NeuLinkButton to="/contact" variant="secondary" size="lg">Talk to us</NeuLinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
