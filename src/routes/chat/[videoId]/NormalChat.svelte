<script lang="ts">
  import MessageList from "$lib/MessageList.svelte";
  import PaidMessage from "$lib/messages/PaidMessage.svelte";
  import TextMessage from "$lib/messages/TextMessage.svelte";
  import {
    LiveChatPaidMessage,
    LiveChatTextMessage,
  } from "@chooks22/youtubei.js/classes";
  import { getContext } from "svelte";
  import type { Readable } from "svelte/store";
  import { SwiperSlide } from "swiper/svelte";

  type Store = Readable<(LiveChatTextMessage | LiveChatPaidMessage)[]>;
  const messages = getContext<Store>("messages");
</script>

<SwiperSlide data-hash="">
  <MessageList title="All Chat">
    {#each $messages as message}
      {#if message.is(LiveChatTextMessage)}
        <TextMessage {message} />
      {/if}
      {#if message.is(LiveChatPaidMessage)}
        <PaidMessage {message} />
      {/if}
    {/each}
  </MessageList>
</SwiperSlide>
