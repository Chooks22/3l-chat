<script lang="ts">
  import { page } from "$app/stores";
  import AppLoading from "$lib/AppLoading.svelte";
  import type { ChannelInfo } from "$lib/youtube/parser.js";
  import { parseChannel } from "$lib/youtube/parser.js";
  import type { Innertube } from "@chooks22/youtubei.js";
  import type { Video } from "@chooks22/youtubei.js/classes";
  import { getContext, onMount, setContext } from "svelte";
  import { writable, type Readable } from "svelte/store";
  import ChannelNotLive from "./ChannelNotLive.svelte";
  import { startChat, type Stream } from "./start-chat.js";

  const yt = getContext<Readable<Innertube>>("yt");
  const channelId = $page.params.channelId;

  let status: "loading" | "loaded" | "not live" | "live" = "loading";
  let close: () => void;

  const channelInfo = setContext("channel", writable<ChannelInfo | null>(null));
  const stream = setContext<Stream>("stream", {
    chats: writable([]),
    paids: writable([]),
    details: writable(),
  });

  async function start() {
    console.info("getting channel...");
    const channel = await $yt.getChannel(channelId);
    $channelInfo = parseChannel(channel);
    console.debug("channel = %O", channel);
    status = "loaded";

    const video = channel.videos.find(
      (video): video is Video => (video as Video).duration.text === "LIVE"
    );

    console.debug("video = %O", video);
    if (video === undefined) {
      console.info("channel is not live.");
      status = "not live";
      return;
    }

    console.info("getting video...");
    const videoInfo = await $yt.getInfo(video.id);
    console.info("got video.");

    close = await startChat(videoInfo, stream);
    status = "live";
  }

  onMount(() => {
    start();
    return () => close?.();
  });
</script>

<svelte:head>
  {#if $channelInfo !== null}
    <title>3L Chat - {$channelInfo.name}</title>
  {/if}
</svelte:head>

{#if status === "loading"}
  <AppLoading message="Getting Channel..." />
{:else if status === "loaded"}
  <AppLoading message="Getting Stream..." />
{:else if status === "not live"}
  <ChannelNotLive />
{:else}
  <slot />
{/if}
