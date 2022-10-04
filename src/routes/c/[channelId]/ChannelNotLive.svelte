<script lang="ts">
  import type { ChannelInfo } from "$lib/youtube/parser.js";
  import { getContext, onMount } from "svelte";
  import type { Readable } from "svelte/store";

  const channel = getContext<Readable<ChannelInfo>>("channel");

  let modern = false;
  onMount(() => {
    modern = CSS.supports("backdrop-filter", "blur(12px)");
  });
</script>

{#if modern}
  <div
    style:background-image={`url(${$channel.icon.thumb})`}
    class="brightness-[0.15] fixed z-0 w-full h-full bg-center bg-cover"
  />
{/if}

<div class="grow backdrop-blur-md flex items-center w-full px-4">
  <div class="flex justify-between w-full">
    <img
      src={$channel.icon.best}
      alt={$channel.name}
      width="128"
      height="128"
      class="w-32 h-32 my-auto rounded"
    />
    <div class="flex flex-col justify-between text-right">
      <span>
        <h6 class="text-neutral-200 text-2xl font-semibold">
          {$channel.name}
        </h6>
        <span class="text-neutral-400 text-lg">is currently not live.</span>
      </span>
      <span class="space-x-2">
        <a href={$channel.url} class="underline" rel="noopener" target="_blank">
          youtube
        </a>
        <a href="/" class="underline">go back</a>
      </span>
    </div>
  </div>
</div>
