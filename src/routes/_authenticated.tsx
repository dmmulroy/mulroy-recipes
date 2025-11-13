import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  async beforeLoad(ctx) {
    if (ctx.context.user === null) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      auth layout
      <Outlet />
    </div>
  );
}
