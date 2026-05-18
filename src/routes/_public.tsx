import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ModalsProvider } from "@/components/ModalsProvider";
import { SpotterModal } from "@/components/SpotterModal";
import { PricingGuideModal } from "@/components/PricingGuideModal";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <ModalsProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <SpotterModal />
      <PricingGuideModal />
      <Toaster />
    </ModalsProvider>
  );
}
