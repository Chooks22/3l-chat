<script lang="ts">
  import "swiper/css";
  import "./swiper.css";

  import { page } from "$app/stores";
  import type { Chat } from "$lib/youtube/parser.js";
  import type { Innertube } from "@chooks22/youtubei.js";
  import type { Video } from "@chooks22/youtubei.js/classes";
  import type { Channel } from "@chooks22/youtubei.js/youtube";
  import { getContext, onMount, setContext } from "svelte";
  import { writable, type Readable } from "svelte/store";
  import { HashNavigation } from "swiper";
  import { Swiper } from "swiper/svelte";

  import BottomBar from "./BottomBar.svelte";
  import MembersChat from "./MembersChat.svelte";
  import NormalChat from "./NormalChat.svelte";
  import { startChat } from "./start-chat.js";
  import SuperChat from "./SuperChat.svelte";

  const yt = getContext<Readable<Innertube>>("yt");
  const chats = writable<Chat[]>([]);
  const idx = writable<number>(0);

  setContext("chats", chats);
  setContext("page", idx);

  let channel: Channel;
  let status: "loading" | "loaded" | "live" = "loading";
  let close: () => void;

  async function start() {
    console.info("getting channel...");
    channel = await $yt.getChannel($page.params.channelId);
    console.debug("channel = %O", channel);
    const video = channel.videos.find(
      (video): video is Video => (video as Video).duration.text === "LIVE"
    );

    console.debug("video = %O", video);
    if (video === undefined) {
      console.info("channel is not live.");
      status = "loaded";
      return;
    }

    console.info("getting video...");
    const videoInfo = await $yt.getInfo(video.id);
    console.debug("videoInfo = %O", videoInfo);
    console.info("got video.");

    close = await startChat(videoInfo, chats);

    status = "live";
  }

  onMount(() => {
    start();
    return () => close?.();
  });
</script>

{#if status === "loading"}
  <span>starting livechat...</span>
{:else if status === "loaded"}
  <span>youtuber is not live.</span>
  <a href="/" class="underline">go back</a>
{:else}
  <Swiper
    modules={[HashNavigation]}
    class="flex flex-col w-screen h-full"
    hashNavigation={{ replaceState: true, watchState: true }}
    on:slideChange={(e) => ($idx = e.detail[0].realIndex)}
  >
    <NormalChat />
    <MembersChat />
    <SuperChat />
    <BottomBar slot="container-end" />
  </Swiper>
{/if}
