<script lang="ts">
  import type { MemberAdd } from "$lib/youtube/parser.js";

  export let chat: MemberAdd;
</script>

<li class="shrink-0 flex flex-col w-full my-1 overflow-hidden rounded-sm">
  <div class="flex w-full gap-4 p-4 bg-green-800">
    <img
      src={chat.author.icon}
      alt={chat.author.name}
      class="w-12 h-12 rounded-full"
      width="48"
      height="48"
    />
    <div class="flex flex-col">
      <span class="font-semibold">{chat.author.name}</span>
      <span>{chat.data.subheader.text}</span>
    </div>
  </div>
</li>
