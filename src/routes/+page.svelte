<script lang="ts">
  import ChannelCard from "$lib/channels/ChannelCard.svelte";
  import type { Innertube } from "@chooks22/youtubei.js";
  import type { Channel } from "@chooks22/youtubei.js/classes";
  import { getContext } from "svelte";
  import { TailSpin } from "svelte-loaders";
  import { portal } from "svelte-portal";
  import type { Readable } from "svelte/store";
  import { fade, fly } from "svelte/transition";
  import type { Margins } from "./+layout.svelte";

  // @todo: login
  const it = getContext<Readable<Innertube>>("yt");
  const margins = getContext<Readable<Margins>>("margins");

  let query: string;
  let prevQuery: string;
  let channels: Promise<Channel[]>;

  async function search(query: string) {
    let res = await $it.search(query, { type: "channel" });
    return res.channels as Channel[];
  }
</script>

<form
  use:portal={"#header"}
  class="bg-neutral-800 flex gap-2 p-4 shadow-lg"
  on:submit|preventDefault={() => {
    if (query !== prevQuery) {
      prevQuery = query;
      channels = search(query);
    }
  }}
>
  <input
    class="text-neutral-100 bg-neutral-700 w-full px-4 py-2 border-none rounded shadow-sm outline-none"
    placeholder="Search YouTube channel"
    type="search"
    bind:value={query}
  />
  <button
    class="hover:bg-purple-500 active:bg-purple-700 font-icon flex items-center justify-center w-10 h-10 p-4 text-2xl bg-purple-600 rounded-full"
    type="submit"
  >
    search
  </button>
</form>

{#if channels === undefined}
  <!-- @todo: favourites -->
{:else}
  {#await channels}
    <div
      out:fade
      class="absolute left-0 flex items-center w-full"
      style:height={`calc(100% - ${$margins.top + $margins.bottom}px)`}
    >
      <div class="flex justify-center w-full">
        <TailSpin color="#a855f7" />
      </div>
    </div>
  {:then channels}
    <ul class="flex flex-col gap-4 py-4">
      {#each channels as channel, i (channel.author.id)}
        <li in:fly={{ x: -200, delay: 100 * i }}>
          <ChannelCard {channel} />
        </li>
      {/each}
    </ul>
  {/await}
{/if}
