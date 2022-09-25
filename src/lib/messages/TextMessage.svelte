<script lang="ts">
  import type LiveChatTextMessage from "youtubei.js/dist/src/parser/classes/livechat/items/LiveChatTextMessage";
  import LiveChatAuthorBadge from "youtubei.js/dist/src/parser/classes/LiveChatAuthorBadge";
  import MessageAuthor from "./MessageAuthor.svelte";
  import MessageContent from "./MessageContent.svelte";

  export let message: LiveChatTextMessage;
</script>

<li class="flex">
  {#if message.author !== undefined}
    <img
      src={message.author.thumbnails[0].url}
      alt=""
      class="w-6 h-6 mx-2 rounded-full"
    />
    <span class="ml-2">
      <MessageAuthor colorize author={message.author} />
      <MessageContent runs={message.message.runs} />
    </span>
  {:else}
    <MessageContent runs={message.message.runs} />
  {/if}
</li>
