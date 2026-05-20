import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { NeuModal } from "@/components/neu/NeuModal";
import { NeuInput, NeuTextarea, NeuField } from "@/components/neu/NeuInput";
import { useModals } from "@/components/ModalsProvider";
import { sendSpotterReferral } from "@/lib/forms.functions";

export function SpotterModal() {
  const { spotterOpen, closeSpotter } = useModals();
  const submit = useServerFn(sendSpotterReferral);
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (spotterOpen) {
      setDone(false);
      setError(null);
    }
  }, [spotterOpen]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await submit({
        data: {
          spotter_name: String(fd.get("spotter_name") || ""),
          spotter_email: String(fd.get("spotter_email") || ""),
          spotter_phone: String(fd.get("spotter_phone") || ""),
          lead_name: String(fd.get("lead_name") || ""),
          lead_company: String(fd.get("lead_company") || ""),
          lead_contact: String(fd.get("lead_contact") || ""),
          lead_aware: String(fd.get("lead_aware") || ""),
          notes: String(fd.get("notes") || ""),
        },
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <NeuModal open={spotterOpen} onClose={closeSpotter} title={done ? "Referral Received." : "Refer a Business. Earn Commission."}>
      {done ? (
        <div className="text-center py-6">
          <p className="text-base text-[#0b4650]">
            Thank you for the referral. We'll reach out to your lead within 48 hours and keep you posted on the outcome.
          </p>
          <button
            onClick={closeSpotter}
            className="mt-8 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-display)", background: "#e6ff2b", color: "#0b4650", boxShadow: "6px 6px 12px #c5cdd4, -6px -6px 12px #ffffff" }}
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-[#4a6670]">
            Know an SME that needs structure? Refer them. If they sign with us, you earn.
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <NeuField label="Your Name" required><NeuInput name="spotter_name" required maxLength={120} /></NeuField>
              <NeuField label="Your Email" required><NeuInput type="email" name="spotter_email" required /></NeuField>
            </div>
            <NeuField label="Your Phone (optional)"><NeuInput name="spotter_phone" maxLength={40} /></NeuField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <NeuField label="Lead Name" required><NeuInput name="lead_name" required maxLength={160} /></NeuField>
              <NeuField label="Lead Company" required><NeuInput name="lead_company" required maxLength={160} /></NeuField>
            </div>
            <NeuField label="Lead Contact (email or phone)" required>
              <NeuInput name="lead_contact" required maxLength={200} />
            </NeuField>

            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-[#0b4650]">
                Does the referred business know they are being referred?<span className="text-[#0b4650]"> *</span>
              </legend>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-[#0b4650]">
                  <input type="radio" name="lead_aware" value="Yes" required /> Yes
                </label>
                <label className="flex items-center gap-2 text-sm text-[#0b4650]">
                  <input type="radio" name="lead_aware" value="No" /> No
                </label>
              </div>
            </fieldset>

            <NeuField label="Notes — what do they need help with?">
              <NeuTextarea name="notes" maxLength={2000} />
            </NeuField>

            {error && <p className="text-sm text-[#c4523a]">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full px-6 py-4 text-sm font-bold uppercase tracking-wider disabled:opacity-50"
              style={{ fontFamily: "var(--font-display)", background: "#e6ff2b", color: "#0b4650", boxShadow: "6px 6px 12px #c5cdd4, -6px -6px 12px #ffffff" }}
            >
              {busy ? "Sending…" : "Submit Referral"}
            </button>
          </form>
        </>
      )}
    </NeuModal>
  );
}
