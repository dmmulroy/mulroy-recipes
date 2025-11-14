import LiveStoreSharedWorker from "@livestore/adapter-web/shared-worker?sharedworker";
import type React from "react";
import { FPSMeter } from "@overengineering/fps-meter";
import { LiveStoreProvider } from "@livestore/react";
import { makePersistedAdapter } from "@livestore/adapter-web";
import { unstable_batchedUpdates as batchUpdates } from "react-dom";
import LiveStoreWorker from "./livestore.worker.ts?worker";
import { getStoreId } from "./store-id";
import { schema, SyncPayload } from "./schema";
import { Skeleton } from "~/components/ui/skeleton";

const storeId = getStoreId();

const adapter = makePersistedAdapter({
  storage: { type: "opfs" },
  worker: LiveStoreWorker,
  sharedWorker: LiveStoreSharedWorker,
});

export const LiveStoreShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <LiveStoreProvider
    schema={schema}
    adapter={adapter}
    renderLoading={() => (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-4 w-80" />
      </div>
    )}
    batchUpdates={batchUpdates}
    storeId={storeId}
    syncPayloadSchema={SyncPayload}
    syncPayload={{ authToken: "insecure-token-change-me" }}
  >
    <div style={{ top: 0, right: 0, position: "absolute", background: "#333" }}>
      <FPSMeter height={40} />
    </div>
    {children}
  </LiveStoreProvider>
);
