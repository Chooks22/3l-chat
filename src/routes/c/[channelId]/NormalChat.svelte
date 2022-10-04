<script lang="ts">
  import MessageList from "$lib/MessageList.svelte";
  import MemberMessage from "$lib/messages/MemberMessage.svelte";
  import PaidMessage from "$lib/messages/PaidMessage.svelte";
  import StickerMessage from "$lib/messages/StickerMessage.svelte";
  import TextMessage from "$lib/messages/TextMessage.svelte";
  import { getContext } from "svelte";
  import { SwiperSlide } from "swiper/svelte";
  import type { Stream } from "./start-chat.js";

  const { chats } = getContext<Stream>("stream");
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
