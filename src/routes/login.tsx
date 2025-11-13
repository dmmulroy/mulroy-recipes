import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "~/components/login-form";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center p-6">
      <LoginForm />
    </div>
  );
}
