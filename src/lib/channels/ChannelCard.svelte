<script lang="ts">
  import type { Channel } from "@chooks22/youtubei.js/classes";

  function getVanity(url: string | null): string {
    if (url !== null) {
      const vanity = url.slice(url.lastIndexOf("/"));
      if (vanity.length < 25) {
        return vanity;
      }
    }

    return "";
  }

  export let channel: Channel;
</script>

<li
  class="grid grid-cols-[auto,1fr] grid-rows-[1fr,1fr] py-2 mx-4 overflow-hidden rounded-md shrink-0 bg-neutral-800 shadow-sm"
>
  <img
    src={"https:" + channel.author.best_thumbnail?.url}
    alt=""
    class="w-24 h-24 mr-6 -my-2 row-span-full "
  />
  <div class="flex flex-col">
    <h5
      class="relative inline-block text-lg leading-none"
      class:verified={channel.author.is_verified}
    >
      {channel.author.name}
    </h5>
    <span class="text-xs align-text-top text-neutral-400">
      {getVanity(channel.author.url)}
    </span>
  </div>
  <div
    class="flex flex-col justify-end pt-0 text-sm leading-tight text-neutral-500"
  >
    <span>{channel.subscribers}</span>
    <span>{channel.videos}</span>
  </div>
</li>

<style>
  .verified::after {
    content: "verified";
    @apply text-red-600 font-icon-outlined;
  }
</style>
