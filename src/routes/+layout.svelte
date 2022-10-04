<script lang="ts" context="module">
  export interface Margins {
    top: number;
    bottom: number;
  }
</script>

<script lang="ts">
  import "@fontsource/material-icons";
  import "@fontsource/material-icons-outlined";
  import "../app.css";

  import { goto } from "$app/navigation";
  import AppLoading from "$lib/AppLoading.svelte";
  import type { Innertube } from "@chooks22/youtubei.js";
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";

  const yt = setContext("yt", writable<Innertube>());
  const margins = setContext(
    "margins",
    writable<Margins>({ top: 0, bottom: 0 })
  );

  onMount(async () => {
    if (location.pathname === "/") {
      const pinned = localStorage.getItem("pinned");
      if (pinned !== null) {
        goto(`/c/${pinned}`);
      }
    }

    const { innertube } = await import("$lib/youtube/index.js");
    $yt = await innertube();
  });
</script>

<header
  id="header"
  class="fixed top-0 left-0 z-40 w-screen"
  bind:clientHeight={$margins.top}
/>

<main
  class="grow flex flex-col w-full"
  style:margin-top={`${$margins.top}px`}
  style:margin-bottom={`${$margins.bottom}px`}
>
  {#if $yt === undefined}
    <AppLoading />
  {:else}
    <slot />
  {/if}
</main>

<footer
  id="footer"
  class="fixed bottom-0 left-0 z-40 w-screen"
  bind:clientHeight={$margins.bottom}
/>
