// eslint-disable-next-line spaced-comment
/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

async function cacheFirst(req: Request) {
  // cannot use $env for service workers.
  // https://github.com/sveltejs/kit/issues/5717
  const cached = await caches.match(req)
  if (cached) {
    return cached
  }

  return fetch(req)
}

self.addEventListener('fetch', e => {
  e.respondWith(cacheFirst(e.request))
})
