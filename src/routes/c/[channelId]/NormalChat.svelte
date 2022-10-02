<script lang="ts">
  import MessageList from "$lib/MessageList.svelte";
  import MemberMessage from "$lib/messages/MemberMessage.svelte";
  import PaidMessage from "$lib/messages/PaidMessage.svelte";
  import StickerMessage from "$lib/messages/StickerMessage.svelte";
  import TextMessage from "$lib/messages/TextMessage.svelte";
  import type { Chat } from "$lib/youtube/parser.js";
  import { getContext } from "svelte";
  import type { Readable } from "svelte/store";
  import { SwiperSlide } from "swiper/svelte";

  const chats = getContext<Readable<Chat[]>>("chats");
</script>

<SwiperSlide data-hash="">
  <MessageList title="All Chat">
    {#each $chats as chat (chat.id)}
      {#if chat.type === "text"}
        <TextMessage {chat} />
      {:else if chat.type === "member"}
        <MemberMessage {chat} />
      {:else if chat.type === "paid"}
        <PaidMessage {chat} />
      {:else}
        <StickerMessage {chat} />
      {/if}
    {/each}
  </MessageList>
</SwiperSlide>
