<script lang="ts">
  import type { MemberAdd } from "$lib/youtube/parser.js";

  export let chat: MemberAdd;
</script>

<li class="flex flex-col w-full my-2 overflow-hidden rounded-sm shrink-0">
  <div class="bg-green-800 w-full flex p-4 gap-4">
    <img
      src={chat.author.icon}
      alt={chat.author.name}
      class="h-12 w-12 rounded-full"
      width="48"
      height="48"
    />
    <div class="flex flex-col">
      <span class="font-semibold">{chat.author.name}</span>
      <span>{chat.data.subheader.text}</span>
    </div>
  </div>
</li>
