<script lang="ts">
  import "@fontsource/material-icons";
  import "@fontsource/material-icons-outlined";
  import "../app.css";

  import { env } from "$env/dynamic/public";
  import { Innertube, UniversalCache } from "@chooks22/youtubei.js";
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";

  const proxyUrl = new URL(env.PUBLIC_PROXY_URL);
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
    const request = new Request(
      url,
      input instanceof Request ? input : undefined
    );

    headers.delete("user-agent");

    // fetch the url
    return fetch(request, { ...init, headers });
  };

  const it = writable<Innertube>();
  setContext("yt", it);

  onMount(async () => {
    $it = await Innertube.create({
      cache: new UniversalCache(true),
      fetch: proxy,
    });
  });
</script>

<main class="flex flex-col w-full h-full overflow-hidden">
  {#if $it === undefined}
    <!-- @todo: better loading placeholder -->
    <span>loading</span>
  {:else}
    <slot />
  {/if}
</main>
