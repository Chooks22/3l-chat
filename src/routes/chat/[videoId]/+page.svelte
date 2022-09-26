<script lang="ts">
  import { page } from "$app/stores";
  import { getContext, onMount, setContext } from "svelte";
  import { writable, type Readable } from "svelte/store";
  import { HashNavigation } from "swiper";
  import "swiper/css";
  import { Swiper } from "swiper/svelte";

  import type { Innertube } from "@chooks22/youtubei.js";

  import {
    AddChatItemAction,
    type LiveChatPaidMessage,
    type LiveChatTextMessage,
  } from "@chooks22/youtubei.js/classes";
  import { LiveChat, type ChatAction } from "@chooks22/youtubei.js/youtube";
  import BottomBar from "./BottomBar.svelte";
  import MembersChat from "./MembersChat.svelte";
  import NormalChat from "./NormalChat.svelte";
  import SuperChat from "./SuperChat.svelte";

  const { videoId } = $page.params;

  let idx = 0;
  const it = getContext<Readable<Innertube>>("yt");

  let livechat: LiveChat;

  type Message = LiveChatTextMessage | LiveChatPaidMessage;
  let messages = writable<Message[]>([]);
  setContext("messages", messages);

  async function start() {
    console.info("getting video");
    const info = await $it.getInfo(videoId);
    livechat = new LiveChat(info);

    livechat.on("start", () => console.info("livechat started"));
    livechat.on("chat-update", (action: ChatAction) => {
      if (action.is(AddChatItemAction) && action.item !== null) {
        console.debug(action.item);
        $messages.push(action.item as Message);
        $messages = $messages;
      }
    });

    livechat.start();
  }

  onMount(() => {
    start();
    return () => livechat?.stop();
  });
</script>

<Swiper
  modules={[HashNavigation]}
  class="flex flex-col w-screen h-full"
  hashNavigation={{ replaceState: true, watchState: true }}
  on:slideChange={(e) => (idx = e.detail[0].realIndex)}
>
  <NormalChat />
  <MembersChat />
  <SuperChat />
  <BottomBar {idx} slot="container-end" />
</Swiper>

<style>
  :global(.swiper-wrapper) {
    height: calc(100% - 4rem);
  }
</style>
