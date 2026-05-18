import { createFileRoute } from "@tanstack/react-router";
import { NeuLinkButton } from "@/components/neu/NeuButton";

export const Route = createFileRoute("/_public/company")({
  head: () => ({
    meta: [
      { title: "Company — Capacitiq" },
      { name: "description", content: "Learn about Capacitiq's philosophy, mission, and approach. A B-BBEE Level 1 business support agency operating across South Africa." },
      { property: "og:title", content: "About Capacitiq" },
      { property: "og:description", content: "Our philosophy, mission, and the team behind it." },
      { property: "og:url", content: "/company" },
    ],
    links: [{ rel: "canonical", href: "/company" }],
  }),
  component: CompanyPage,
});

function CompanyPage() {
  return (
    <div className="mx-auto max-w-5xl px-5">
      <section className="pt-12 md:pt-20 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Company</p>
        <h1 className="mt-3 text-5xl md:text-6xl font-bold tracking-tight text-balance">A backbone for builders.</h1>
        <p className="mt-5 text-lg text-[var(--ink-soft)] max-w-3xl">
          Capacitiq is a remote-first business support agency for South African startups and SMEs. We exist because founders shouldn't have to hold operations, sales, design, and admin together with both hands while trying to grow.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6 py-12">
        <div className="neu-out rounded-3xl p-8">
          <h2 className="text-2xl font-bold">Mission</h2>
          <p className="mt-3 text-[var(--ink-soft)]">
            Equip every South African SME with the operational structure of a much larger company — without the headcount, the overhead, or the wait.
          </p>
        </div>
        <div className="neu-out rounded-3xl p-8">
          <h2 className="text-2xl font-bold">Philosophy</h2>
          <p className="mt-3 text-[var(--ink-soft)]">
            Clarity beats speed. We'd rather build one system that lasts three years than ten that collapse in six months.
          </p>
        </div>
        <div className="neu-out rounded-3xl p-8">
          <h2 className="text-2xl font-bold">How we work</h2>
          <p className="mt-3 text-[var(--ink-soft)]">
            Remote-first. Performance-based contractors across South Africa. Lean overhead means more of your spend goes to actual work, not office leases.
          </p>
        </div>
        <div className="neu-out rounded-3xl p-8">
          <h2 className="text-2xl font-bold">Credentials</h2>
          <p className="mt-3 text-[var(--ink-soft)]">
            B-BBEE Level 1 registered. Eligible for full procurement recognition with corporates and government tenders.
          </p>
        </div>
      </section>

      <section className="my-16 neu-out rounded-[2rem] p-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Want to know if we're a fit?</h2>
        <p className="mt-3 text-[var(--ink-soft)] max-w-xl mx-auto">Start with a 30-minute discovery call. No deck, no pitch — just questions.</p>
        <div className="mt-7"><NeuLinkButton to="/contact" variant="primary" size="lg">Book a discovery call</NeuLinkButton></div>
      </section>
    </div>
  );
}
