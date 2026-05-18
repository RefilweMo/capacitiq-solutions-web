import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { NeuModal } from "@/components/neu/NeuModal";
import { NeuInput, NeuField } from "@/components/neu/NeuInput";
import { NeuButton } from "@/components/neu/NeuButton";
import { useModals } from "@/components/ModalsProvider";
import { sendPricingGuideLead } from "@/lib/forms.functions";
import { toast } from "sonner";

export function PricingGuideModal() {
  const { pricingOpen, closePricing } = useModals();
  const submit = useServerFn(sendPricingGuideLead);
  const [busy, setBusy] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await submit({
        data: {
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          company: String(fd.get("company") || ""),
        },
      });
      toast.success("Check your inbox — the guide is on its way.");
      (e.target as HTMLFormElement).reset();
      closePricing();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <NeuModal open={pricingOpen} onClose={closePricing} title="Get the Capacitiq Pricing Guide">
      <p className="mb-6 text-sm text-[var(--ink-soft)]">
        Drop your details. We'll email the full pricing breakdown straight to you.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <NeuField label="Name" required>
          <NeuInput name="name" required />
        </NeuField>
        <NeuField label="Work email" required>
          <NeuInput type="email" name="email" required />
        </NeuField>
        <NeuField label="Company (optional)">
          <NeuInput name="company" />
        </NeuField>
        <NeuButton type="submit" variant="primary" size="lg" disabled={busy} className="w-full">
          {busy ? "Sending…" : "Email me the guide"}
        </NeuButton>
      </form>
    </NeuModal>
  );
}
