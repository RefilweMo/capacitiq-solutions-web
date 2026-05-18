import * as React from "react";

type Ctx = {
  spotterOpen: boolean;
  openSpotter: () => void;
  closeSpotter: () => void;
  pricingOpen: boolean;
  openPricing: () => void;
  closePricing: () => void;
};

const ModalsContext = React.createContext<Ctx | null>(null);

export function ModalsProvider({ children }: { children: React.ReactNode }) {
  const [spotterOpen, setSpotter] = React.useState(false);
  const [pricingOpen, setPricing] = React.useState(false);
  return (
    <ModalsContext.Provider
      value={{
        spotterOpen,
        openSpotter: () => setSpotter(true),
        closeSpotter: () => setSpotter(false),
        pricingOpen,
        openPricing: () => setPricing(true),
        closePricing: () => setPricing(false),
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
}

export function useModals() {
  const ctx = React.useContext(ModalsContext);
  if (!ctx) throw new Error("useModals must be used inside ModalsProvider");
  return ctx;
}
