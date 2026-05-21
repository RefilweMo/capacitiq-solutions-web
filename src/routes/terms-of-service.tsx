import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/terms-of-service")({
  beforeLoad: () => { throw redirect({ to: "/legal/$slug", params: { slug: "terms-of-service" } }); },
});
