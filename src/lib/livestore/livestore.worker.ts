import { makeWorker } from "@livestore/adapter-web/worker";
import { makeHttpSync } from "@livestore/sync-cf/client";

import { schema } from "./schema";

makeWorker({
  schema,
  sync: {
    // Use /sync path to avoid Assets binding intercepting root path requests (alternative: wrangler.toml `run_worker_first = true` but less efficient)
    backend: makeHttpSync({ url: `${globalThis.location.origin}/sync` }),
    initialSyncOptions: { _tag: "Blocking", timeout: 5000 },
  },
});
