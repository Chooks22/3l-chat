// eslint-disable-next-line spaced-comment
/// <reference lib="webworker" />
import { PUBLIC_PROXY_URL } from '$env/static/public'
declare const self: ServiceWorkerGlobalScope

async function cacheFirst(req: Request) {
  if (!req.url.startsWith(PUBLIC_PROXY_URL)) {
    const cached = await caches.match(req)
    if (cached) {
      return cached
    }
  }

  return fetch(req)
}

self.addEventListener('fetch', e => {
  e.respondWith(cacheFirst(e.request))
})
