import { ak as acquireRelease, al as map, am as make$1, an as empty, ao as withFiberRuntime, ap as _void, aq as interruptAllAs, ar as map$1, as as combine, at as make$2, au as intoDeferred, av as isEffect, aw as fiberIdWith, ax as interrupt, ay as dual, az as sync, aA as tap, aB as forkDaemon, aC as pipeArguments, aD as NodeInspectSymbol, aE as format, aF as empty$1, aG as has, h as runFork, aH as none, aI as get, aJ as set, aK as isSome, aL as remove, aM as isFailure, aN as reduceWithContext, aO as isInterruptedOnly, aP as unsafeDone, aQ as hasProperty, aR as has$1, aS as constFalse, aT as ids, U as Union, T as TaggedStruct, aU as UndefinedOr, aV as Boolean$, A as String$, aW as pluck, aX as typeSchema, aY as suspend, l as windowChannel, N as Number$, aZ as broadcastChannel, g as gen, j as async, i as makeMeshNode, n as makeNodeName$1, ag as flatten, ah as tap$1, ai as runDrain, aa as withSpan, c as scoped, t as tapCauseLogPretty, d as annotateLogs, p as provide, e as prettyWithThread, w as withMinimumLogLevel, D as Debug, s as shouldNeverHappen, a_ as encode, C as ContentscriptIframeSearchParamsSchema, P as Packet, a$ as orDie, o as never, u as succeed, b0 as die } from "./schemas-DVnRa0Nd.js";
import { BUILD_NUMBER } from "./buildnumber.js";
const TypeId = /* @__PURE__ */ Symbol.for("effect/FiberMap");
const isFiberMap = (u) => hasProperty(u, TypeId);
const Proto = {
  [TypeId]: TypeId,
  [Symbol.iterator]() {
    if (this.state._tag === "Closed") {
      return empty$1();
    }
    return this.state.backing[Symbol.iterator]();
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "FiberMap",
      state: this.state
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
const unsafeMake = (backing, deferred) => {
  const self = Object.create(Proto);
  self.state = {
    _tag: "Open",
    backing
  };
  self.deferred = deferred;
  return self;
};
const make = () => acquireRelease(map(make$1(), (deferred) => unsafeMake(empty(), deferred)), (map2) => withFiberRuntime((parent) => {
  const state = map2.state;
  if (state._tag === "Closed") return _void;
  map2.state = {
    _tag: "Closed"
  };
  return interruptAllAs(map$1(state.backing, ([, fiber]) => fiber), combine(parent.id(), internalFiberId)).pipe(intoDeferred(map2.deferred));
}));
const internalFiberIdId = -1;
const internalFiberId = /* @__PURE__ */ make$2(internalFiberIdId, 0);
const isInternalInterruption = /* @__PURE__ */ reduceWithContext(void 0, {
  emptyCase: constFalse,
  failCase: constFalse,
  dieCase: constFalse,
  interruptCase: (_, fiberId) => has$1(ids(fiberId), internalFiberIdId),
  sequentialCase: (_, left, right) => left || right,
  parallelCase: (_, left, right) => left || right
});
const unsafeSet = /* @__PURE__ */ dual((args) => isFiberMap(args[0]), (self, key, fiber, options) => {
  if (self.state._tag === "Closed") {
    fiber.unsafeInterruptAsFork(combine(options?.interruptAs ?? none, internalFiberId));
    return;
  }
  const previous = get(self.state.backing, key);
  if (previous._tag === "Some") {
    if (options?.onlyIfMissing === true) {
      fiber.unsafeInterruptAsFork(combine(options?.interruptAs ?? none, internalFiberId));
      return;
    } else if (previous.value === fiber) {
      return;
    }
    previous.value.unsafeInterruptAsFork(combine(options?.interruptAs ?? none, internalFiberId));
  }
  set(self.state.backing, key, fiber);
  fiber.addObserver((exit) => {
    if (self.state._tag === "Closed") {
      return;
    }
    const current = get(self.state.backing, key);
    if (isSome(current) && fiber === current.value) {
      remove(self.state.backing, key);
    }
    if (isFailure(exit) && (options?.propagateInterruption === true ? !isInternalInterruption(exit.cause) : !isInterruptedOnly(exit.cause))) {
      unsafeDone(self.deferred, exit);
    }
  });
});
const unsafeHas = /* @__PURE__ */ dual(2, (self, key) => self.state._tag === "Closed" ? false : has(self.state.backing, key));
const constInterruptedFiber = /* @__PURE__ */ function() {
  let fiber = void 0;
  return () => {
    if (fiber === void 0) {
      fiber = runFork(interrupt);
    }
    return fiber;
  };
}();
const run = function() {
  const self = arguments[0];
  if (isEffect(arguments[2])) {
    return runImpl(self, arguments[1], arguments[2], arguments[3]);
  }
  const key = arguments[1];
  const options = arguments[2];
  return (effect) => runImpl(self, key, effect, options);
};
const runImpl = (self, key, effect, options) => fiberIdWith((fiberId) => {
  if (self.state._tag === "Closed") {
    return interrupt;
  } else if (options?.onlyIfMissing === true && unsafeHas(self, key)) {
    return sync(constInterruptedFiber);
  }
  return tap(forkDaemon(effect), (fiber) => unsafeSet(self, key, fiber, {
    ...options,
    interruptAs: fiberId
  }));
});
const RequestSessions = TaggedStruct("RequestSessions", {});
const SessionInfo = TaggedStruct("SessionInfo", {
  storeId: String$,
  clientId: String$,
  sessionId: String$,
  schemaAlias: String$,
  isLeader: Boolean$,
  /**
   * Browser origin that produced this SessionInfo (for example, 'http://localhost:5173').
   * Set by browser-based publishers so DevTools can defensively filter by origin.
   * Currently only needed by the browser extension; non‑browser publishers typically set `undefined`.
   */
  origin: UndefinedOr(String$)
});
const Message = Union(RequestSessions, SessionInfo);
const DevtoolsMode = Union(
  TaggedStruct("node", {
    /** WebSocket URL */
    url: String$
  }),
  TaggedStruct("web", {}),
  TaggedStruct("browser-extension", {})
);
DevtoolsMode.pipe(pluck("_tag"), typeSchema);
const makeNodeName = {
  client: {
    session: ({ storeId, clientId, sessionId }) => `client-session-${storeId}-${clientId}-${sessionId}`,
    leader: ({ storeId, clientId }) => `client-leader-${storeId}-${clientId}`
  }
};
broadcastChannel({
  channelName: "session-info",
  schema: Message
});
const ClientSessionContentscriptMainReq = TaggedStruct("ClientSessionContentscriptMainReq", {
  storeId: String$,
  clientId: String$,
  sessionId: String$
});
const ClientSessionContentscriptMainRes = TaggedStruct("ClientSessionContentscriptMainRes", {
  tabId: Number$
});
const makeStaticClientSessionChannel = {
  contentscriptMain: suspend(
    () => windowChannel({
      listenWindow: window,
      sendWindow: window,
      schema: { listen: ClientSessionContentscriptMainReq, send: ClientSessionContentscriptMainRes },
      ids: { own: "contentscript-main-static", other: "client-session-static" }
    })
  ),
  clientSession: suspend(
    () => windowChannel({
      listenWindow: window,
      sendWindow: window,
      schema: { listen: ClientSessionContentscriptMainRes, send: ClientSessionContentscriptMainReq },
      ids: { own: "client-session-static", other: "contentscript-main-static" }
    })
  )
};
gen(function* () {
  if (document.querySelector('meta[name="livestore-devtools"]')) {
    return;
  }
  const tabId = yield* async((cb) => {
    const connection = chrome.runtime.connect();
    const listener = (message) => {
      if (message.type === "tabId") {
        connection.onMessage.removeListener(listener);
        connection.disconnect();
        cb(succeed(message.tabId));
      }
    };
    connection.onMessage.addListener(listener);
    connection.postMessage({ type: "getTabId" });
  });
  const webmeshNode = yield* makeMeshNode(makeNodeName$1.contentscriptMain({ tabId }));
  yield* connectViaIframe(webmeshNode, tabId);
  const fiberMap = yield* make();
  const clientSessionStaticChannel = yield* makeStaticClientSessionChannel.contentscriptMain;
  const connect = ({ clientId, sessionId, storeId }) => gen(function* () {
    yield* clientSessionStaticChannel.send(ClientSessionContentscriptMainRes.make({ tabId }));
    const clientSessionNodeName = makeNodeName.client.session({
      storeId,
      clientId,
      sessionId
    });
    const clientSessionChannel = yield* windowChannel({
      // eslint-disable-next-line unicorn/prefer-global-this
      listenWindow: window,
      // eslint-disable-next-line unicorn/prefer-global-this
      sendWindow: window,
      schema: Packet,
      ids: { own: webmeshNode.nodeName, other: clientSessionNodeName }
    });
    yield* webmeshNode.addEdge({
      target: clientSessionNodeName,
      edgeChannel: clientSessionChannel,
      replaceIfExists: true
    }).pipe(acquireRelease(() => webmeshNode.removeEdge(clientSessionNodeName).pipe(orDie)));
    return yield* never;
  }).pipe(tapCauseLogPretty, run(fiberMap, `${storeId}-${clientId}-${sessionId}`));
  yield* clientSessionStaticChannel.listen.pipe(flatten(), tap$1(connect), runDrain);
}).pipe(
  withSpan("LSD:contentscript-main"),
  scoped,
  tapCauseLogPretty,
  annotateLogs({
    thread: "contentscript-main",
    origin: "app",
    BUILD_NUMBER
  }),
  provide(prettyWithThread("window(contentscript-main)")),
  withMinimumLogLevel(Debug),
  runFork
);
const connectViaIframe = (webmeshNode, tabId) => gen(function* () {
  const id = `livestore-devtools-iframe-${BUILD_NUMBER}`;
  if (document.getElementById(id)) {
    shouldNeverHappen(`[@livestore/devtools-chrome:contentscript-main] iframe already exists`);
  }
  const el = document.createElement("div");
  el.id = id;
  const root = el.attachShadow({ mode: "closed" });
  const iframe = document.createElement("iframe");
  iframe.hidden = true;
  root.append(iframe);
  (document.body ?? document.documentElement).append(el);
  const searchParamsEntries = yield* encode(ContentscriptIframeSearchParamsSchema)(
    ContentscriptIframeSearchParamsSchema.make({
      // The secret is used for security reasons so no one else can connect to the iframe
      secret: Math.random().toString(36),
      tabId
    })
  );
  yield* async((cb) => {
    iframe.addEventListener("load", () => cb(_void));
    iframe.addEventListener("error", (e) => cb(die(e)));
    const url = new URL(chrome.runtime.getURL(`/contentscript-iframe-${BUILD_NUMBER}.html`));
    for (const [key, value] of Object.entries(searchParamsEntries)) {
      url.searchParams.set(key, value);
    }
    iframe.contentWindow.location.href = url.toString();
  });
  const contentscriptIframeNodeName = makeNodeName$1.contentscriptIframe({ tabId });
  const iframeChannel = yield* windowChannel({
    // eslint-disable-next-line unicorn/prefer-global-this
    listenWindow: window,
    sendWindow: iframe.contentWindow,
    schema: Packet,
    ids: { own: webmeshNode.nodeName, other: contentscriptIframeNodeName }
  });
  yield* webmeshNode.addEdge({
    target: contentscriptIframeNodeName,
    edgeChannel: iframeChannel
  });
});
//# sourceMappingURL=contentscript-main-Cna3v8oz.js.map
