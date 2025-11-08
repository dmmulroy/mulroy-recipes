import { g as gen, v as decodeUnknown, C as ContentscriptIframeSearchParamsSchema, i as makeMeshNode, n as makeNodeName, l as windowChannel, P as Packet, c as scoped, t as tapCauseLogPretty, d as annotateLogs, p as provide, e as prettyWithThread, w as withMinimumLogLevel, D as Debug, h as runFork } from "./schemas-DVnRa0Nd.js";
import { BUILD_NUMBER } from "./buildnumber.js";
import { c as connectViaServiceWorker } from "./service-worker-edge-DFrdh3-w.js";
const main = gen(function* () {
  const searchParams = new URL(globalThis.location.href).searchParams;
  const { tabId } = yield* decodeUnknown(ContentscriptIframeSearchParamsSchema)(
    Object.fromEntries(searchParams.entries())
  );
  const webmeshNode = yield* makeMeshNode(makeNodeName.contentscriptIframe({ tabId }));
  globalThis.__debugWebmeshNode = webmeshNode;
  const contentscriptMainNodeName = makeNodeName.contentscriptMain({ tabId });
  const contentscriptMainChannel = yield* windowChannel({
    // eslint-disable-next-line unicorn/prefer-global-this
    listenWindow: window,
    sendWindow: window.parent,
    schema: Packet,
    ids: { own: webmeshNode.nodeName, other: contentscriptMainNodeName }
  });
  yield* webmeshNode.addEdge({
    target: contentscriptMainNodeName,
    edgeChannel: contentscriptMainChannel
  });
  return yield* connectViaServiceWorker(webmeshNode, tabId);
});
main.pipe(
  scoped,
  tapCauseLogPretty,
  annotateLogs({ thread: "contentscript-iframe", origin: "extension", BUILD_NUMBER }),
  provide(prettyWithThread("contentscript-iframe")),
  withMinimumLogLevel(Debug),
  runFork
);
//# sourceMappingURL=contentscript-iframe.js.map
