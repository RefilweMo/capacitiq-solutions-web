import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { NeuModal } from "@/components/neu/NeuModal";
import { NeuInput, NeuTextarea, NeuField } from "@/components/neu/NeuInput";
import { NeuButton } from "@/components/neu/NeuButton";
import { useModals } from "@/components/ModalsProvider";
import { sendSpotterReferral } from "@/lib/forms.functions";
import { toast } from "sonner";

export function SpotterModal() {
  const { spotterOpen, closeSpotter } = useModals();
  const submit = useServerFn(sendSpotterReferral);
  const [busy, setBusy] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await submit({
        data: {
          spotter_name: String(fd.get("spotter_name") || ""),
          spotter_email: String(fd.get("spotter_email") || ""),
          spotter_phone: String(fd.get("spotter_phone") || ""),
          lead_name: String(fd.get("lead_name") || ""),
          lead_company: String(fd.get("lead_company") || ""),
          lead_contact: String(fd.get("lead_contact") || ""),
          notes: String(fd.get("notes") || ""),
        },
      });
      toast.success("Referral sent. We'll be in touch within 48 hours.");
      (e.target as HTMLFormElement).reset();
      closeSpotter();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <NeuModal open={spotterOpen} onClose={closeSpotter} title="Refer a business. Earn commission.">
      <p className="mb-6 text-sm text-[var(--ink-soft)]">
        Know an SME that needs structure? Refer them. If they sign with us, you earn.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NeuField label="Your name" required>
            <NeuInput name="spotter_name" required maxLength={120} />
          </NeuField>
          <NeuField label="Your email" required>
            <NeuInput type="email" name="spotter_email" required />
          </NeuField>
        </div>
        <NeuField label="Your phone (optional)">
          <NeuInput name="spotter_phone" maxLength={40} />
        </NeuField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NeuField label="Lead name" required>
            <NeuInput name="lead_name" required maxLength={160} />
          </NeuField>
          <NeuField label="Lead company">
            <NeuInput name="lead_company" maxLength={160} />
          </NeuField>
        </div>
        <NeuField label="Lead contact (email or phone)" required>
          <NeuInput name="lead_contact" required maxLength={200} />
        </NeuField>
        <NeuField label="Notes">
          <NeuTextarea name="notes" maxLength={2000} placeholder="What do they need help with?" />
        </NeuField>
        <NeuButton type="submit" variant="lime" size="lg" disabled={busy} className="w-full">
          {busy ? "Sending…" : "Submit referral"}
        </NeuButton>
      </form>
    </NeuModal>
  );
}
