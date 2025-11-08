import { g as gen, r as runtime, i as makeMeshNode, n as makeNodeName, ab as decodeOption, a8 as messagePortChannel, P as Packet, a9 as toOpenChannel, ac as makeChannelName, t as tapCauseLogPretty, ad as forkScoped, o as never, aa as withSpan, ae as CopyToClipboard, af as Void, ag as flatten, ah as tap, a5 as promise, ai as runDrain, c as scoped, d as annotateLogs, p as provide, e as prettyWithThread, w as withMinimumLogLevel, D as Debug, h as runFork$1, a7 as ServiceWorkerWebmeshEdgePort } from "./schemas-DVnRa0Nd.js";
import { BUILD_NUMBER } from "./buildnumber.js";
import { r as runFork } from "./Runtime-tg7FVKZy.js";
gen(function* () {
  const runtime$1 = yield* runtime();
  const webmeshNode = yield* makeMeshNode(makeNodeName.extensionWorker());
  globalThis.__debugWebmeshNode = webmeshNode;
  self.addEventListener(
    "message",
    (e) => gen(function* () {
      const decodedMessageRes = decodeOption(ServiceWorkerWebmeshEdgePort)(e.data);
      if (decodedMessageRes._tag === "None") return;
      const { port, source, tabId } = decodedMessageRes.value;
      return yield* gen(function* () {
        const edgeChannel = yield* messagePortChannel({ port, schema: Packet });
        const edgeChannelWithHeartbeat = yield* toOpenChannel(edgeChannel, {
          heartbeat: { interval: "5 seconds", timeout: "5 seconds" }
        });
        yield* webmeshNode.addEdge({ edgeChannel: edgeChannelWithHeartbeat, target: source, replaceIfExists: true });
        if ((yield* webmeshNode.hasChannel({
          target: makeNodeName.devtools({ tabId }),
          channelName: makeChannelName.clipboard({ tabId })
        })) === false) {
          yield* listenForClipboardMessages({ webmeshNode, tabId }).pipe(tapCauseLogPretty, forkScoped);
        }
        return yield* never;
      });
    }).pipe(
      withSpan("[@livestore/devtools-chrome:background] service worker handler"),
      tapCauseLogPretty,
      runFork(runtime$1)
    )
  );
  chrome.runtime.onConnect.addListener((connection) => {
    connection.onMessage.addListener((message) => {
      if (message.type === "getTabId") {
        connection.postMessage({ type: "tabId", tabId: connection.sender.tab.id });
      } else if (message.type === "keepAlive") ;
      else {
        console.warn(`[@livestore/devtools-chrome:background] unknown message type`, message);
      }
    });
  });
  let offscreenDocCreated = false;
  const listenForClipboardMessages = ({ webmeshNode: webmeshNode2, tabId }) => gen(function* () {
    const devtoolsChannel = yield* webmeshNode2.makeChannel({
      target: makeNodeName.devtools({ tabId }),
      channelName: makeChannelName.clipboard({ tabId }),
      schema: { send: Void, listen: CopyToClipboard },
      mode: "direct"
    });
    const addToClipboard = (value) => promise(async () => {
      if (offscreenDocCreated === false) {
        await chrome.offscreen.createDocument({
          url: "offscreen-for-clipboard.html",
          reasons: [chrome.offscreen.Reason.CLIPBOARD],
          justification: "Write text to the clipboard."
        });
        offscreenDocCreated = true;
      }
      await chrome.runtime.sendMessage({
        type: "copy-data-to-clipboard",
        target: "offscreen-doc",
        data: value
      });
    });
    yield* devtoolsChannel.listen.pipe(
      flatten(),
      tap((msg) => addToClipboard(msg.text))
    ).pipe(runDrain);
  });
  return yield* never;
}).pipe(
  withSpan("@livestore/devtools-chrome:background:main"),
  scoped,
  tapCauseLogPretty,
  annotateLogs({ thread: "background", origin: "extension", BUILD_NUMBER }),
  provide(prettyWithThread("background")),
  withMinimumLogLevel(Debug),
  runFork$1
);
//# sourceMappingURL=background.js.map
