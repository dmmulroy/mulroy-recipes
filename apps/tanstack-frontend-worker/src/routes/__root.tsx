/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import { LiveStoreShell } from "~/livestore-shell";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";

export const Route = createRootRoute({
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
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <nav className="border-b border-border bg-card">
          <div className="p-4 flex gap-4 text-sm">
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
            <Link
              to="/posts"
              activeProps={{
                className: "font-bold text-primary",
              }}
              inactiveProps={{
                className:
                  "text-muted-foreground hover:text-foreground transition-colors",
              }}
            >
              Posts
            </Link>
            <Link
              to="/users"
              activeProps={{
                className: "font-bold text-primary",
              }}
              inactiveProps={{
                className:
                  "text-muted-foreground hover:text-foreground transition-colors",
              }}
            >
              Users
            </Link>
            <Link
              to="/route-a"
              activeProps={{
                className: "font-bold text-primary",
              }}
              inactiveProps={{
                className:
                  "text-muted-foreground hover:text-foreground transition-colors",
              }}
            >
              Pathless Layout
            </Link>
            <Link
              to="/deferred"
              activeProps={{
                className: "font-bold text-primary",
              }}
              inactiveProps={{
                className:
                  "text-muted-foreground hover:text-foreground transition-colors",
              }}
            >
              Deferred
            </Link>
            <Link
              // @ts-expect-error
              to="/this-route-does-not-exist"
              activeProps={{
                className: "font-bold text-primary",
              }}
              inactiveProps={{
                className:
                  "text-muted-foreground hover:text-foreground transition-colors",
              }}
            >
              This Route Does Not Exist
            </Link>
          </div>
        </nav>
        <LiveStoreShell>{children}</LiveStoreShell>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
