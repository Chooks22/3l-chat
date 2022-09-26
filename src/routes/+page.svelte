<script lang="ts">
  import ChannelCard from "$lib/channels/ChannelCard.svelte";
  import type { Innertube } from "@chooks22/youtubei.js";
  import type { Channel } from "@chooks22/youtubei.js/classes";
  import { getContext } from "svelte";
  import type { Readable } from "svelte/store";

  // @todo: login
  const it = getContext<Readable<Innertube>>("yt");
  let query: string;

  let output: Channel[] = [];
  async function search() {
    const res = await $it.search(query, { type: "channel" });
    output = res.channels as Channel[];
  }
</script>

<form
  class="z-40 flex w-full gap-2 p-4 shadow-lg bg-neutral-800 h-fit"
  on:submit|preventDefault={search}
>
  <input
    class="w-full px-4 py-2 border-none rounded shadow-sm outline-none text-neutral-100 bg-neutral-700"
    placeholder="Search YouTube channel"
    type="search"
    bind:value={query}
  />
  <button
    class="flex items-center justify-center w-10 h-10 p-4 text-2xl bg-purple-600 rounded-full hover:bg-purple-500 active:bg-purple-700 font-icon"
    type="submit"
  >
    search
  </button>
</form>

<ul class="flex flex-col h-full gap-4 py-2 overflow-y-auto">
  {#each output as item}
    <ChannelCard channel={item} />
  {/each}
</ul>
