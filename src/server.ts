import handler, { type ServerEntry } from "@tanstack/react-start/server-entry";
import { env } from "cloudflare:workers";
export * from "~/lib/livestore/sync-backend-do";

declare module "@tanstack/react-start" {
  interface Register {
    server: {
      requestContext: Cloudflare.Env;
    };
  }
}

export default {
  fetch(request) {
    return handler.fetch(request, { context: env });
  },
} satisfies ServerEntry;
