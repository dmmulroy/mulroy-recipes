import * as SyncBackend from "@livestore/sync-cf/cf-worker";

export class SyncBackendDO extends SyncBackend.makeDurableObject({
  onPush: async (message, context) => {
    console.log(
      "onPush",
      message.batch,
      "storeId:",
      context.storeId,
      "payload:",
      context.payload,
    );
  },
  onPull: async (message, context) => {
    console.log(
      "onPull",
      message,
      "storeId:",
      context.storeId,
      "payload:",
      context.payload,
    );
  },
}) {}
