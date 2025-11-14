import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { LiveStoreShell } from "~/lib/livestore/livestore-shell";
import { Skeleton } from "~/components/ui/skeleton";

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

function LoadingFallback() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <Skeleton className="h-4 w-80" />
    </div>
  );
}

function RouteComponent() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LiveStoreShell>
        <Outlet />
      </LiveStoreShell>
    </Suspense>
  );
}
