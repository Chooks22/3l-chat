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

<a
  href={`/c/${channel.author.id}`}
  class="grid grid-cols-[auto,1fr] grid-rows-[1fr,1fr] py-2 mx-4 overflow-hidden rounded-md shrink-0 bg-neutral-800 shadow-sm hover:bg-neutral-700 cursor-pointer"
>
  <img
    src={"https:" + channel.author.best_thumbnail?.url}
    alt=""
    class="row-span-full w-24 h-24 mr-6 -my-2"
  />
  <div class="flex flex-col">
    <h5
      class="relative inline-block text-lg leading-none"
      class:verified={channel.author.is_verified}
    >
      {channel.author.name}
    </h5>
    <span class="text-neutral-400 text-xs align-text-top">
      {getVanity(channel.author.url)}
    </span>
  </div>
  <div
    class="text-neutral-500 flex flex-col justify-end pt-0 text-sm leading-tight"
  >
    <span>{channel.subscribers}</span>
    <span>{channel.videos}</span>
  </div>
</a>

<style>
  .verified::after {
    content: "verified";
    @apply text-red-600 font-icon-outlined;
  }
</style>
