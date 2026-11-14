// Offline-Cache: zuerst Netz, sonst gespeicherte Kopie. Rechnungsdaten liegen nicht hier, sondern im Gerätespeicher.
const C = "finanz-v2";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(["./", "index.html", "icon.svg", "manifest.webmanifest"]).catch(()=>{}))); });
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { if (r && (r.ok || r.type === "opaque")){ const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request)));
});
