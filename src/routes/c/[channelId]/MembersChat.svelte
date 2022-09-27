<script lang="ts">
  import MessageList from "$lib/MessageList.svelte";
  import PaidMessage from "$lib/messages/PaidMessage.svelte";
  import TextMessage from "$lib/messages/TextMessage.svelte";
  import type { Chat } from "$lib/youtube/parser.js";
  import { getContext } from "svelte";
  import type { Readable } from "svelte/store";
  import { SwiperSlide } from "swiper/svelte";

  const chats = getContext<Readable<Chat[]>>("chats");
</script>

<SwiperSlide data-hash="members">
  <MessageList title="Members Chat">
    {#each $chats as chat (chat.id)}
      {#if chat.author.isMember}
        {#if chat.type === "text"}
          <TextMessage {chat} />
        {:else}
          <PaidMessage {chat} />
        {/if}
      {/if}
    {/each}
  </MessageList>
</SwiperSlide>
