<script lang="ts">
  import "@fontsource/material-icons";
  import "@fontsource/material-icons-outlined";
  import "../app.css";

  import { PUBLIC_PROXY_URL } from "$env/static/public";
  import { Innertube, UniversalCache } from "@chooks22/youtubei.js";
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";

  const proxyUrl = new URL(PUBLIC_PROXY_URL);
  const proxy: typeof fetch = async (input, init) => {
    // url
    const url =
      typeof input === "string"
        ? new URL(input)
        : input instanceof URL
        ? input
        : new URL(input.url);

    // transform the url for use with our proxy
    url.searchParams.set("__host", url.host);
    url.host = proxyUrl.host;
    url.protocol = proxyUrl.protocol;

    const headers = init?.headers
      ? new Headers(init.headers)
      : input instanceof Request
      ? input.headers
      : new Headers();

    // now serialize the headers
    url.searchParams.set("__headers", JSON.stringify([...headers]));

    // copy over the request
    let request: Request;

    if (input instanceof Request) {
      // @ts-expect-error outdated types
      input.duplex = "half";
      request = new Request(url, input);
    } else {
      request = new Request(url);
    }

    headers.delete("user-agent");

    // fetch the url
    return fetch(request, { ...init, headers });
  };

  const it = setContext("yt", writable<Innertube>());
  const margins = setContext("margins", writable({ top: 0, bottom: 0 }));

  onMount(async () => {
    $it = await Innertube.create({
      cache: new UniversalCache(true),
      fetch: proxy,
    });
  });
</script>

<header
  id="header"
  class="fixed top-0 left-0 z-40 w-screen"
  bind:clientHeight={$margins.top}
/>

<main
  class="flex flex-col w-full"
  style:margin-top={`${$margins.top}px`}
  style:margin-bottom={`${$margins.bottom}px`}
>
  {#if $it === undefined}
    <!-- @todo: better loading placeholder -->
    <span>loading</span>
  {:else}
    <slot />
  {/if}
</main>

<footer
  id="footer"
  class="fixed bottom-0 left-0 z-40 w-screen"
  bind:clientHeight={$margins.bottom}
/>
