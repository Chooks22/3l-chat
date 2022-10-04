<script lang="ts">
  import type { Chat } from "$lib/youtube/parser.js";
  import MessageAuthor from "./MessageAuthor.svelte";
  import MessageContent from "./MessageContent.svelte";

  export let chat: Chat;
</script>

<li class="flex">
  {#if chat.author !== undefined}
    <img
      src={chat.author.icon}
      alt={chat.author.name}
      width="24"
      height="24"
      class="w-6 h-6 mx-2 rounded-full"
    />
    <span class="ml-2 overflow-x-hidden">
      <MessageAuthor colorize author={chat.author} />
      <MessageContent runs={chat.runs} />
    </span>
  {:else}
    <MessageContent runs={chat.runs} />
  {/if}
</li>
