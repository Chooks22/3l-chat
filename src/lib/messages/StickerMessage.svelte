<script lang="ts">
  import type { StickerAdd } from "$lib/youtube/parser.js";

  export let chat: StickerAdd;
</script>

<li
  class="flex justify-between px-4 py-2 my-1"
  style:background-color={chat.data.styles.background}
>
  <div class="flex gap-4">
    <img
      src={chat.author.icon}
      alt={chat.author.name}
      class="w-12 h-12 rounded-full"
      width="48"
      height="48"
    />
    <div class="flex flex-col">
      <span style:color={chat.data.styles.author.text}>
        {chat.author.name}
      </span>
      <span>
        {chat.data.amount}
      </span>
    </div>
  </div>
  <img
    src={chat.data.stickerUrl}
    alt="chat sticker"
    class="flex-shrink-0 w-32 h-32"
    height="128"
    width="128"
  />
</li>
