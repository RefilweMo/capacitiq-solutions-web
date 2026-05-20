import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-4">
      <div className="max-w-md text-center neu-out rounded-3xl p-10">
        <h1 className="text-7xl font-bold text-[var(--brand)]">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-[var(--ink)]">Page not found</h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center neu-out rounded-full bg-[var(--brand)] text-[var(--brand-ink)] px-6 py-3 text-sm font-semibold"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-4">
      <div className="max-w-md text-center neu-out rounded-3xl p-10">
        <h1 className="text-xl font-semibold text-[var(--brand)]">This page didn't load</h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="neu-out inline-flex items-center justify-center rounded-full bg-[var(--brand)] text-[var(--brand-ink)] px-6 py-3 text-sm font-semibold"
          >Try again</button>
          <a href="/" className="neu-out inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-[var(--ink)]">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Capacitiq — Business Strategy, Design & Operations" },
      { name: "description", content: "Capacitiq is a consulting, design, PR, and virtual assistance agency helping South African startups and SMEs build the systems, strategy, and execution support they need to grow with intention." },
      { name: "author", content: "Capacitiq" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Capacitiq" },
      { property: "og:title", content: "Capacitiq — Business Strategy, Design & Operations" },
      { name: "twitter:title", content: "Capacitiq — Business Strategy, Design & Operations" },
      { property: "og:description", content: "Capacitiq is a consulting, design, PR, and virtual assistance agency helping South African startups and SMEs build the systems, strategy, and execution support they need to grow with intention." },
      { name: "twitter:description", content: "Capacitiq is a consulting, design, PR, and virtual assistance agency helping South African startups and SMEs build the systems, strategy, and execution support they need to grow with intention." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d313b923-60a4-4384-b9a0-c65000c0d639/id-preview-ba450e6e--21c16479-d22e-47ee-9b47-99bdf25bc017.lovable.app-1779263133377.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d313b923-60a4-4384-b9a0-c65000c0d639/id-preview-ba450e6e--21c16479-d22e-47ee-9b47-99bdf25bc017.lovable.app-1779263133377.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&family=Inter:wght@400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  React.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
      queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
