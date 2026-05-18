import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function NeuModal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl neu-out p-8", className)}>
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 neu-out-sm flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink)]"
        >
          <X className="h-4 w-4" />
        </button>
        {title && <h2 className="mb-6 text-2xl font-bold">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
