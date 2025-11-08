import LiveStoreSharedWorker from "@livestore/adapter-web/shared-worker?sharedworker";
import type React from "react";
import { FPSMeter } from "@overengineering/fps-meter";
import { LiveStoreProvider } from "@livestore/react";
import { makePersistedAdapter } from "@livestore/adapter-web";
import { unstable_batchedUpdates as batchUpdates } from "react-dom";
import LiveStoreWorker from "./livestore.worker.ts?worker";
import { getStoreId } from "@mulroy-recipes/livestore/store-id";
import { schema, SyncPayload } from "@mulroy-recipes/livestore/schema";

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
    renderLoading={(_) => <div>Loading LiveStore ({_.stage})...</div>}
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
