import { g as gen, r as runtime, s as shouldNeverHappen, m as make, f as forkIn, a as andThen, _ as _await, b as forever, t as tapCauseLogPretty, c as scoped, d as annotateLogs, p as provide, e as prettyWithThread, w as withMinimumLogLevel, D as Debug, h as runFork$1, i as makeMeshNode, j as async, k as addFinalizer, l as windowChannel, n as makeNodeName, o as never, q as extend, P as Packet, u as succeed } from "./schemas-DVnRa0Nd.js";
import { BUILD_NUMBER } from "./buildnumber.js";
import { c as connectViaServiceWorker } from "./service-worker-edge-DFrdh3-w.js";
import { r as runFork } from "./Runtime-tg7FVKZy.js";
globalThis.process = { env: {} };
const makeDevtoolsPanel = (panel, scope) => gen(function* () {
  const runtime$1 = yield* runtime();
  const tabId = chrome.devtools.inspectedWindow.tabId;
  const webmeshNode = yield* makeMeshNode(makeNodeName.panel({ tabId }));
  globalThis.__debugWebmeshNode = webmeshNode;
  yield* connectViaServiceWorker(webmeshNode, tabId).pipe(tapCauseLogPretty, forkIn(scope));
  let alreadyLoaded = false;
  panel.onShown.addListener(
    (panelWindow) => gen(function* () {
      if (alreadyLoaded) return;
      alreadyLoaded = true;
      const rootEl = panelWindow.document.querySelector("#root");
      const inspectedWindowOrigin = yield* async((cb) => {
        chrome.devtools.inspectedWindow.eval(`location.origin`, (inspectedWindowOrigin2) => {
          cb(succeed(inspectedWindowOrigin2));
        });
      });
      const devtoolsUrl = `${inspectedWindowOrigin}/_livestore/browser-extension/?autoconnect&tabId=${tabId}`;
      void fetch(devtoolsUrl).then(async (res) => {
        const showErr = () => {
          rootEl.innerHTML = `<div style="padding: 12px; font-size: 14px;">
  LiveStore Devtools entrypoint not found. Please make sure you have the LiveStore Devtools Vite plugin enabled.
</div>`;
        };
        if (res.ok === false) {
          showErr();
        }
        const htmlContent = await res.text();
        const isLiveStoreDevtoolsHtml = htmlContent.includes(`<meta name="livestore-devtools" content="true" />`);
        if (isLiveStoreDevtoolsHtml === false) {
          showErr();
        }
      });
      const iframe = panelWindow.document.createElement("iframe");
      iframe.id = "devtools-iframe";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.src = devtoolsUrl;
      const startTime = performance.now();
      iframe.addEventListener(
        "load",
        () => gen(function* () {
          const endTime = performance.now();
          console.log(`Iframe loaded in ${(endTime - startTime).toFixed(2)}ms`);
        }).pipe(tapCauseLogPretty, runFork(runtime$1))
      );
      rootEl.innerHTML = "";
      rootEl.append(iframe);
      yield* addFinalizer(
        () => gen(function* () {
          iframe.remove();
          rootEl.innerHTML = "";
        })
      );
      const iframeWindowChannel = yield* windowChannel({
        listenWindow: panelWindow,
        sendWindow: iframe.contentWindow,
        schema: Packet,
        ids: { own: "devtools-panel", other: "devtools" }
      });
      yield* webmeshNode.addEdge({
        edgeChannel: iframeWindowChannel,
        target: makeNodeName.devtools({ tabId })
      });
      return yield* never;
    }).pipe(tapCauseLogPretty, runFork(runtime$1))
  );
  panel.onHidden.addListener(() => {
  });
  return yield* never;
}).pipe(extend(scope));
const main = gen(function* () {
  const runtime$1 = yield* runtime();
  if (chrome.runtime.lastError) {
    console.error("chrome.runtime.lastError", chrome.runtime.lastError);
    shouldNeverHappen(`Error when connecting to background page`);
  }
  chrome.devtools.panels.create("LiveStore", "icon128.png", "panel.html", (panel) => {
    gen(function* () {
      const scope = yield* make();
      yield* makeDevtoolsPanel(panel, scope).pipe(forkIn(scope), andThen(_await));
    }).pipe(forever, tapCauseLogPretty, runFork(runtime$1));
  });
});
main.pipe(
  scoped,
  tapCauseLogPretty,
  annotateLogs({ thread: "devtools-panel", BUILD_NUMBER }),
  provide(prettyWithThread("devtools-panel")),
  withMinimumLogLevel(Debug),
  runFork$1
);
//# sourceMappingURL=devtools.js.map
