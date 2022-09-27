<script lang="ts">
  import type { PaidChat } from "$lib/youtube/parser.js";
  import MessageAuthor from "./MessageAuthor.svelte";
  import MessageContent from "./MessageContent.svelte";

  export let chat: PaidChat;
</script>

<li class="flex flex-col w-full my-2 overflow-hidden rounded-sm shrink-0">
  <div
    class="flex gap-4 px-4 py-2 font-bold"
    style:background-color={chat.data.styles.header.background}
    style:color={chat.data.styles.header.text}
  >
    <img src={chat.author.icon} alt="" class="inline w-12 h-12 rounded-full" />
    <div class="flex flex-col">
      <span>
        <MessageAuthor author={chat.author} />
      </span>
      <span>
        {chat.data.amount}
      </span>
    </div>
  </div>
  {#if chat.runs.length > 0}
    <div
      class="px-4 py-2"
      style:background-color={chat.data.styles.body.background}
      style:color={chat.data.styles.body.text}
    >
      <MessageContent runs={chat.runs} />
    </div>
  {/if}
</li>
