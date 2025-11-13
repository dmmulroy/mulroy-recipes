import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  if (!user) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back!</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-medium">Email:</span>{" "}
            <span className="text-muted-foreground">{user.email}</span>
          </div>
          {user.name && (
            <div>
              <span className="font-medium">Name:</span>{" "}
              <span className="text-muted-foreground">{user.name}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
