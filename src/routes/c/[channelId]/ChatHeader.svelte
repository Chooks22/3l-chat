<script lang="ts">
  import { page } from "$app/stores";
  import type { ChannelInfo } from "$lib/youtube/parser.js";
  import { getContext, onMount } from "svelte";
  import type { Readable } from "svelte/store";
  import type { Stream } from "./start-chat.js";

  const channelId = $page.params.channelId;
  const { details } = getContext<Stream>("stream");
  const channel = getContext<Readable<ChannelInfo>>("channel");

  let isFullscreen = false;
  let isOpen = false;

  let pinned = localStorage.getItem("pinned");
  $: isPinned = pinned === channelId;

  async function toggleFullscreen() {
    if (isFullscreen) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
    isFullscreen = !isFullscreen;
  }

  function togglePinned() {
    if (isPinned) {
      localStorage.removeItem("pinned");
      pinned = null;
    } else {
      localStorage.setItem("pinned", channelId);
      pinned = channelId;
    }
  }

  function toggleDetails() {
    isOpen = !isOpen;
  }

  onMount(() => {
    isFullscreen = Boolean(document.fullscreenElement);
  });
</script>

<div
  class="bg-neutral-800 relative z-50 flex items-center w-full h-12 gap-4 px-4 py-3 overflow-hidden transition-all shadow-lg"
>
  <a class="icon-button font-icon" href="/" title="Go to Home">arrow_back</a>
  <span
    class="grow overflow-x-hidden transition-opacity duration-100"
    class:opacity-0={isOpen}
  >
    <h3 class="font-semibold truncate">{$details.title}</h3>
  </span>
  <nav class="flex flex-row-reverse gap-4 mb-auto">
    <button
      class="icon-button font-icon"
      class:-rotate-180={isOpen}
      on:click|preventDefault={toggleDetails}
      title="Toggle Details"
    >
      expand_more
    </button>
    <button
      class="icon-button font-icon"
      on:click|preventDefault={toggleFullscreen}
      title="Toggle Fullscreen"
    >
      {isFullscreen ? "fullscreen_exit" : "fullscreen"}
    </button>
    <button
      class="icon-button font-icon-outlined transition-all"
      class:font-icon={isPinned}
      on:click|preventDefault={togglePinned}
      title={isPinned ? "Unpin Channel" : "Pin Channel"}
    >
      push_pin
    </button>
  </nav>
</div>

<div
  class="absolute top-0 z-40 w-full px-4 py-3 mt-12 space-y-2 transition-[transform,opacity] duration-150 opacity-0 bg-neutral-800 shadow-md rounded-b-md"
  class:-translate-y-full={!isOpen}
  class:opacity-100={isOpen}
>
  <div>
    <h3 class="font-semibold">{$details.title}</h3>
    <span class="text-neutral-400 text-sm">{$channel.name}</span>
  </div>
  <div class="text-neutral-400 text-sm">
    <span>{$details.views}</span>
    <div class="flex items-center justify-between">
      <span>{$details.date}</span>
      <span class="flex items-center gap-2">
        <span class="font-icon text-lg leading-none">thumb_up</span>
        <span>{$details.likes}</span>
      </span>
    </div>
  </div>
</div>
