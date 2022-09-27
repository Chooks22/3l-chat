<script lang="ts">
  import { page } from "$app/stores";
  import { getContext, onMount, setContext } from "svelte";
  import { writable, type Readable } from "svelte/store";
  import { HashNavigation } from "swiper";
  import "swiper/css";
  import { Swiper } from "swiper/svelte";
  import "./swiper.css";

  import { parseChatMessage, type Chat } from "$lib/youtube/parser.js";
  import type { Innertube } from "@chooks22/youtubei.js";
  import {
    AddChatItemAction,
    LiveChatPaidMessage,
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
  type RawMessage = LiveChatTextMessage | LiveChatPaidMessage;

  let chats = writable<Chat[]>([]);
  setContext("chats", chats);

  async function start() {
    console.info("getting video");
    const info = await $it.getInfo(videoId);
    livechat = new LiveChat(info);

    livechat.on("start", () => console.info("livechat started"));
    livechat.on("chat-update", (action: ChatAction) => {
      if (action.is(AddChatItemAction) && action.item !== null) {
        console.debug(action.item);
        const chat = parseChatMessage(action.item as RawMessage);
        $chats.push(chat);
        $chats = $chats;
      }
    });

    livechat.start();
  }

  onMount(() => {
    start();
    const timer = setInterval(() => ($chats = $chats.slice(-250)), 1000);

    return () => {
      clearInterval(timer);
      livechat?.stop();
    };
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
