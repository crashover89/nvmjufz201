// Offline-Cache: immer zuerst die neueste Version aus dem Netz holen, sonst gespeicherte Kopie.
// Rechnungsdaten liegen nicht hier, sondern im Gerätespeicher.
const C = "finanz-v8";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(["./", "index.html", "icon.svg", "manifest.webmanifest"]).catch(()=>{}))); });
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const same = new URL(e.request.url).origin === location.origin;
  const net = same ? fetch(e.request.url, {cache:"no-cache"}) : fetch(e.request);
  e.respondWith(net.then(r => { if (r && (r.ok || r.type === "opaque")){ const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request, {ignoreSearch:true})));
});
