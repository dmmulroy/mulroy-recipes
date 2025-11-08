import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

export const Route = createFileRoute("/")({
  loader: () => getData(),
  component: Home,
});

const getData = createServerFn().handler(() => {
  return {
    message: `Running in ${navigator.userAgent}`,
    myVar: env.MY_VAR,
  };
});

function Home() {
  const data = Route.useLoaderData();

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-2xl font-bold text-foreground">Welcome Home!!!</h3>
      <p className="text-muted-foreground">{data.message}</p>
      <p className="text-sm text-muted-foreground">{data.myVar}</p>
    </div>
  );
}
