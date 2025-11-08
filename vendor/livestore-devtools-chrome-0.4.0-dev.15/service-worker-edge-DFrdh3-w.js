import { x as right, y as some, S as Struct, I as Int, z as fromBrand, A as String$, B as Any, E as Class, O as Option, U as Union, N as Number$, J as JsonValue, T as TaggedStruct, F as Uint8Array$, G as optional, H as mutable, K as withDefaults, L as none, M as TaggedError, Q as Defect, R as mapError, V as is, W as catchAllDefect, X as catchAllCause, Y as fail, Z as isFailType, $ as mapError$1, a0 as optionalWith, a1 as Literal, a2 as Array$, a3 as Record, a4 as pick, g as gen, a5 as promise, a6 as encodeWithTransferables, a7 as ServiceWorkerWebmeshEdgePort, a8 as messagePortChannel, a9 as toOpenChannel, aa as withSpan, c as scoped, b as forever, P as Packet } from "./schemas-DVnRa0Nd.js";
const RefinedConstructorsTypeId = /* @__PURE__ */ Symbol.for("effect/Brand/Refined");
const nominal = () => {
  return Object.assign((args) => args, {
    [RefinedConstructorsTypeId]: RefinedConstructorsTypeId,
    option: (args) => some(args),
    either: (args) => right(args),
    is: (_args) => true
  });
};
const localEventSequenceNumber = nominal();
const ClientEventSequenceNumber = fromBrand(localEventSequenceNumber)(Int);
const globalEventSequenceNumber = nominal();
const GlobalEventSequenceNumber = fromBrand(globalEventSequenceNumber)(Int);
const clientDefault = 0;
const rebaseGenerationDefault = 0;
const EventSequenceNumber = Struct({
  global: GlobalEventSequenceNumber,
  /** Only increments for client-local events */
  client: ClientEventSequenceNumber,
  // TODO also provide a way to see "confirmation level" of event (e.g. confirmed by leader/sync backend)
  // Client only
  rebaseGeneration: Int
}).annotations({
  title: "LiveStore.EventSequenceNumber",
  pretty: () => (seqNum) => toString(seqNum)
});
const toString = (seqNum) => {
  const rebaseGenerationStr = seqNum.rebaseGeneration > 0 ? `r${seqNum.rebaseGeneration}` : "";
  return seqNum.client === 0 ? `e${seqNum.global}${rebaseGenerationStr}` : `e${seqNum.global}.${seqNum.client}${rebaseGenerationStr}`;
};
const nextPair = ({
  seqNum,
  isClient,
  rebaseGeneration
}) => {
  if (isClient) {
    return {
      seqNum: {
        global: seqNum.global,
        client: seqNum.client + 1,
        rebaseGeneration: rebaseGeneration ?? seqNum.rebaseGeneration
      },
      parentSeqNum: seqNum
    };
  }
  return {
    seqNum: {
      global: seqNum.global + 1,
      client: clientDefault,
      rebaseGeneration: rebaseGeneration ?? seqNum.rebaseGeneration
    },
    // NOTE we always point to `client: 0` for non-client-local events
    parentSeqNum: { global: seqNum.global, client: clientDefault, rebaseGeneration: seqNum.rebaseGeneration }
  };
};
Struct({
  name: String$,
  args: Any,
  seqNum: EventSequenceNumber,
  parentSeqNum: EventSequenceNumber,
  clientId: String$,
  sessionId: String$
}).annotations({ title: "LiveStoreEvent.AnyDecoded" });
const AnyEncoded = Struct({
  name: String$,
  args: Any,
  seqNum: EventSequenceNumber,
  parentSeqNum: EventSequenceNumber,
  clientId: String$,
  sessionId: String$
}).annotations({ title: "LiveStoreEvent.AnyEncoded" });
Struct({
  name: String$,
  args: Any,
  seqNum: GlobalEventSequenceNumber,
  parentSeqNum: GlobalEventSequenceNumber,
  clientId: String$,
  sessionId: String$
}).annotations({ title: "LiveStoreEvent.AnyEncodedGlobal" });
Struct({
  name: String$,
  args: Any
});
class EncodedWithMeta extends Class("LiveStoreEvent.EncodedWithMeta")({
  name: String$,
  args: Any,
  seqNum: EventSequenceNumber,
  parentSeqNum: EventSequenceNumber,
  clientId: String$,
  sessionId: String$,
  // TODO get rid of `meta` again by cleaning up the usage implementations
  meta: Struct({
    sessionChangeset: Union(
      TaggedStruct("sessionChangeset", {
        data: Uint8Array$,
        debug: Any.pipe(optional)
      }),
      TaggedStruct("no-op", {}),
      TaggedStruct("unset", {})
    ),
    syncMetadata: Option(JsonValue),
    /** Used to detect if the materializer is side effecting (during dev) */
    materializerHashLeader: Option(Number$),
    materializerHashSession: Option(Number$)
  }).pipe(
    mutable,
    optional,
    withDefaults({
      constructor: () => ({
        sessionChangeset: { _tag: "unset" },
        syncMetadata: none(),
        materializerHashLeader: none(),
        materializerHashSession: none()
      }),
      decoding: () => ({
        sessionChangeset: { _tag: "unset" },
        syncMetadata: none(),
        materializerHashLeader: none(),
        materializerHashSession: none()
      })
    })
  )
}) {
  toJSON = () => {
    return {
      seqNum: `${toString(this.seqNum)} → ${toString(this.parentSeqNum)} (${this.clientId}, ${this.sessionId})`,
      name: this.name,
      args: this.args
    };
  };
  /**
   * Example: (global event)
   * For event e2 → e1 which should be rebased on event e3 → e2
   * the resulting event num will be e4 → e3
   *
   * Example: (client event)
   * For event e2.1 → e2 which should be rebased on event e3 → e2
   * the resulting event num will be e3.1 → e3
   *
   * Syntax: e2.2 → e2.1
   *          ^ ^    ^ ^
   *          | |    | +- client parent number
   *          | |    +--- global parent number
   *          | +-- client number
   *          +---- global number
   * Client num is omitted for global events
   */
  rebase = ({
    parentSeqNum,
    isClient,
    rebaseGeneration
  }) => new EncodedWithMeta({
    ...this,
    ...nextPair({ seqNum: parentSeqNum, isClient, rebaseGeneration })
  });
  static fromGlobal = (event, meta) => new EncodedWithMeta({
    ...event,
    seqNum: {
      global: event.seqNum,
      client: clientDefault,
      rebaseGeneration: rebaseGenerationDefault
    },
    parentSeqNum: {
      global: event.parentSeqNum,
      client: clientDefault,
      rebaseGeneration: rebaseGenerationDefault
    },
    meta: {
      sessionChangeset: { _tag: "unset" },
      syncMetadata: meta.syncMetadata,
      materializerHashLeader: meta.materializerHashLeader,
      materializerHashSession: meta.materializerHashSession
    }
  });
  toGlobal = () => ({
    ...this,
    seqNum: this.seqNum.global,
    parentSeqNum: this.parentSeqNum.global
  });
}
class UnexpectedError extends TaggedError()("LiveStore.UnexpectedError", {
  cause: Defect,
  note: optional(String$),
  payload: optional(Any)
}) {
  static mapToUnexpectedError = (effect) => effect.pipe(
    mapError((cause) => is(UnexpectedError)(cause) ? cause : new UnexpectedError({ cause })),
    catchAllDefect((cause) => new UnexpectedError({ cause }))
  );
  static mapToUnexpectedErrorLayer = (layer) => layer.pipe(
    catchAllCause(
      (cause) => isFailType(cause) && is(UnexpectedError)(cause.error) ? fail(cause.error) : fail(new UnexpectedError({ cause }))
    )
  );
  static mapToUnexpectedErrorStream = (stream) => stream.pipe(
    mapError$1((cause) => is(UnexpectedError)(cause) ? cause : new UnexpectedError({ cause }))
  );
}
class MaterializerHashMismatchError extends TaggedError()(
  "LiveStore.MaterializerHashMismatchError",
  {
    eventName: String$,
    note: optionalWith(String$, {
      default: () => "Please make sure your event materializer is a pure function without side effects."
    })
  }
) {
}
class IntentionalShutdownCause extends TaggedError()(
  "LiveStore.IntentionalShutdownCause",
  {
    reason: Literal("devtools-reset", "devtools-import", "adapter-reset", "manual")
  }
) {
}
class StoreInterrupted extends TaggedError()("LiveStore.StoreInterrupted", {
  reason: String$
}) {
}
class SqliteError extends TaggedError()("LiveStore.SqliteError", {
  query: optional(
    Struct({
      sql: String$,
      bindValues: Union(Record({ key: String$, value: Any }), Array$(Any))
    })
  ),
  /** The SQLite result code */
  // code: Schema.optional(Schema.Number),
  // Added string support for Expo SQLite (we should refactor this to have a unified error type)
  code: optional(Union(Number$, String$)),
  /** The original SQLite3 error */
  cause: Defect,
  note: optional(String$)
}) {
}
class UnknownEventError extends TaggedError()("LiveStore.UnknownEventError", {
  event: AnyEncoded.pipe(pick("name", "args", "seqNum", "clientId", "sessionId")),
  reason: Literal("event-definition-missing", "materializer-missing"),
  operation: String$,
  note: optional(String$)
}) {
}
class MaterializeError extends TaggedError()("LiveStore.MaterializeError", {
  cause: Union(MaterializerHashMismatchError, SqliteError, UnknownEventError),
  note: optional(String$)
}) {
}
const connectViaServiceWorker = (webmeshNode, tabId) => gen(function* () {
  const swr = yield* promise(() => navigator.serviceWorker.ready);
  if (swr.active === null) {
    return yield* UnexpectedError.make({ cause: `No active service worker` });
  }
  const serviceWorker = swr.active;
  const messageChannel = new MessageChannel();
  const [message, transfers] = yield* encodeWithTransferables(ServiceWorkerWebmeshEdgePort)(
    ServiceWorkerWebmeshEdgePort.make({
      source: webmeshNode.nodeName,
      tabId,
      port: messageChannel.port1
    })
  );
  serviceWorker.postMessage(message, transfers);
  const edgeChannel = yield* messagePortChannel({
    port: messageChannel.port2,
    schema: Packet
  });
  const edgeChannelWithHeartbeat = yield* toOpenChannel(edgeChannel, {
    heartbeat: { interval: "5 seconds", timeout: "5 seconds" }
  });
  yield* webmeshNode.addEdge({
    edgeChannel: edgeChannelWithHeartbeat,
    target: "extension-worker",
    replaceIfExists: true
  });
  yield* edgeChannelWithHeartbeat.closedDeferred;
}).pipe(withSpan("connectViaServiceWorker"), scoped, forever);
export {
  connectViaServiceWorker as c
};
//# sourceMappingURL=service-worker-edge-DFrdh3-w.js.map
