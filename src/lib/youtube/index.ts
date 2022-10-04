import { PUBLIC_PROXY_URL } from '$env/static/public'
import { Innertube, UniversalCache } from '@chooks22/youtubei.js'

const PROXY_URL = new URL(PUBLIC_PROXY_URL)

function normalizeInput(input: URL | RequestInfo): URL {
  if (input instanceof URL) {
    return input
  }

  return typeof input === 'string'
    ? new URL(input)
    : new URL(input.url)
}

function normalizeHeaders(init: Headers | HeadersInit | undefined): Headers {
  if (init === undefined) {
    return new Headers()
  }

  return init instanceof Headers
    ? init
    : new Headers(init)
}

function proxy(input: URL | RequestInfo, init?: RequestInit) {
  const url = normalizeInput(input)
  const headers = normalizeHeaders(init?.headers ?? (input as Request).headers)

  // now serialize the headers
  url.searchParams.set('__host', url.host)
  url.searchParams.set('__headers', JSON.stringify([...headers]))

  // transform the url for use with our proxy
  url.host = PROXY_URL.host
  url.protocol = PROXY_URL.protocol

  // copy over the request
  let request: Request

  if (input instanceof Request) {
    // @ts-expect-error outdated types
    input.duplex = 'half'
    request = new Request(url, input)
  } else {
    request = new Request(url)
  }

  headers.delete('user-agent')

  // fetch the url
  return fetch(request, { ...init, headers })
}

const yt = Innertube.create({
  fetch: proxy,
  cache: new UniversalCache(true),
})

export function innertube(): Promise<Innertube> {
  return yt
}
