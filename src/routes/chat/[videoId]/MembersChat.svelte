<script lang="ts">
  import MessageList from "$lib/MessageList.svelte";
  import TextMessage from "$lib/messages/TextMessage.svelte";
  import { LiveChatTextMessage } from "@chooks22/youtubei.js/classes";
  import { getContext } from "svelte";
  import type { Readable } from "svelte/store";
  import { SwiperSlide } from "swiper/svelte";

  const messages = getContext<Readable<LiveChatTextMessage[]>>("messages");
</script>

<SwiperSlide data-hash="members">
  <MessageList title="Members Chat">
    {#each $messages as message}
      {#if message.is(LiveChatTextMessage) && Number(message.author?.badges.length) > 0}
        <TextMessage {message} />
      {/if}
    {/each}
  </MessageList>
</SwiperSlide>
