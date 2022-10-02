<script lang="ts">
  import MessageList from "$lib/MessageList.svelte";
  import MemberMessage from "$lib/messages/MemberMessage.svelte";
  import PaidMessage from "$lib/messages/PaidMessage.svelte";
  import StickerMessage from "$lib/messages/StickerMessage.svelte";
  import { getContext } from "svelte";
  import type { Readable } from "svelte/store";
  import { SwiperSlide } from "swiper/svelte";

  const chats = getContext<Readable<Chat[]>>("chats");
</script>

<SwiperSlide data-hash="supers">
  <MessageList title="Super Chats">
    {#each $chats as chat (chat.id)}
      {#if chat.type === "paid"}
        <PaidMessage {chat} />
      {:else if chat.type === "member"}
        <MemberMessage {chat} />
      {:else}
        <StickerMessage {chat} />
      {/if}
    {/each}
  </MessageList>
</SwiperSlide>
