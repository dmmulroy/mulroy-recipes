/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import { getSession } from "~/lib/auth/get-session";
import { authClient } from "~/lib/auth/client";
import { LiveStoreShell } from "~/lib/livestore/livestore-shell";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";
import { Button } from "~/components/ui/button";

export const Route = createRootRoute({
  beforeLoad: async () => {
    const session = await getSession();

    return { user: session?.user ?? null };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title:
          "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
    scripts: [
      {
        src: "/customScript.js",
        type: "text/javascript",
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const routeContext = Route.useRouteContext();

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <nav className="border-b border-border bg-card">
          <div className="p-4 flex gap-4 text-sm items-center">
            <Link
              to="/"
              activeProps={{
                className: "font-bold text-primary",
              }}
              inactiveProps={{
                className:
                  "text-muted-foreground hover:text-foreground transition-colors",
              }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>
            {routeContext.user && (
              <>
                <Link
                  to="/dashboard"
                  activeProps={{
                    className: "font-bold text-primary",
                  }}
                  inactiveProps={{
                    className:
                      "text-muted-foreground hover:text-foreground transition-colors",
                  }}
                >
                  Dashboard
                </Link>
                <div className="ml-auto flex items-center gap-4">
                  <span className="text-muted-foreground">
                    {routeContext.user.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            )}
          </div>
        </nav>
        <div>{children}</div>
        {/* <LiveStoreShell>{children}</LiveStoreShell> */}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
