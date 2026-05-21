import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/template-policy")({
  beforeLoad: () => { throw redirect({ to: "/legal/$slug", params: { slug: "template-policy" } }); },
});
