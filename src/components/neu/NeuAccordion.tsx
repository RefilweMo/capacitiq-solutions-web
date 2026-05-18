import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function NeuAccordion({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={cn("neu-out rounded-2xl p-2")}>
            <button
              className="flex w-full items-center justify-between rounded-xl px-4 py-4 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-[var(--ink)]">{item.q}</span>
              <span className="neu-out-sm flex h-9 w-9 items-center justify-center rounded-full text-[var(--brand)]">
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-1 text-sm leading-relaxed text-[var(--ink-soft)]">{item.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
