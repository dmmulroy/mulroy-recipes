import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/foo")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Foo</div>;
}
