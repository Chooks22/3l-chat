<script lang="ts">
  import type LiveChatPaidMessage from "youtubei.js/dist/src/parser/classes/livechat/items/LiveChatPaidMessage";
  import MessageAuthor from "./MessageAuthor.svelte";
  import MessageContent from "./MessageContent.svelte";

  function hexify(color: number) {
    const hex = color.toString(16).slice(2);
    return `#${hex}`;
  }

  export let message: LiveChatPaidMessage;
</script>

<li class="flex flex-col w-full my-2 overflow-hidden rounded-sm shrink-0">
  <div
    class="flex gap-4 px-4 py-2 font-bold"
    style:background-color={hexify(message.header_background_color)}
    style:color={hexify(message.header_text_color)}
  >
    <img
      src={message.author.thumbnails[0].url}
      alt=""
      class="inline w-12 h-12 rounded-full"
    />
    <div class="flex flex-col">
      <span>
        <MessageAuthor author={message.author} />
      </span>
      <span>
        {message.purchase_amount}
      </span>
    </div>
  </div>
  {#if message.message.runs}
    <div
      class="px-4 py-2"
      style:background-color={hexify(message.body_background_color)}
      style:color={hexify(message.body_text_color)}
    >
      <MessageContent runs={message.message.runs} />
    </div>
  {/if}
</li>
