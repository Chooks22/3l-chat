<script lang="ts">
  import MessageList from "$lib/MessageList.svelte";
  import PaidMessage from "$lib/messages/PaidMessage.svelte";
  import { getContext } from "svelte";
  import type { Readable } from "svelte/store";
  import { SwiperSlide } from "swiper/svelte";
  import LiveChatPaidMessage from "youtubei.js/dist/src/parser/classes/livechat/items/LiveChatPaidMessage";

  const messages = getContext<Readable<LiveChatPaidMessage[]>>("messages");
</script>

<SwiperSlide data-hash="supers">
  <MessageList title="Super Chats">
    {#each $messages as message}
      {#if message.is(LiveChatPaidMessage)}
        <PaidMessage {message} />
      {/if}
    {/each}
  </MessageList>
</SwiperSlide>
