import { createFileRoute } from "@tanstack/react-router";
import type { CfTypes } from "@livestore/sync-cf/cf-worker";
import * as SyncBackend from "@livestore/sync-cf/cf-worker";
import { SyncPayload } from "~/lib/livestore/schema";

const validatePayload = (
  payload: typeof SyncPayload.Type | undefined,
  context: { storeId: string },
) => {
  console.log(`Validating connection for store: ${context.storeId}`);
  if (payload?.authToken !== "insecure-token-change-me") {
    throw new Error("Invalid auth token");
  }
};

export const Route = createFileRoute("/sync/")({
  server: {
    // @ts-ignore
    handlers: {
      // @ts-ignore
      POST: async ({ request, context }) => {
        // @ts-ignore
        const searchParams = SyncBackend.matchSyncRequest(request);
        console.log("DB: ", context.DB);

        const ctx: CfTypes.ExecutionContext = {} as CfTypes.ExecutionContext;

        if (searchParams !== undefined) {
          return SyncBackend.handleSyncRequest({
            // @ts-expect-error
            request,
            searchParams,
            ctx,
            syncBackendBinding: "SYNC_BACKEND_DO",
            syncPayloadSchema: SyncPayload,
            validatePayload,
          });
        }

        return new Response("Not found", { status: 404 });
      },
    },
  },
});
