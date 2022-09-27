<script lang="ts">
  import type { ChatAuthor } from "$lib/youtube/parser.js";

  export let author: ChatAuthor;
  export let colorize = false;
</script>

<span class="mr-2">
  <span
    class="font-bold"
    class:text-green-500={colorize && author.isMember}
    class:text-blue-500={colorize && author.isModerator}
  >
    {author.name}
  </span>
  {#if author.isModerator}
    <!-- @todo: handle icon automatically -->
    <span class="text-blue-500 font-icon">build</span>
  {/if}
  {#each author.badges as badge}
    {#if badge.type === "custom"}
      <img src={badge.value} alt={badge.tooltip} class="inline-block mb-1" />
    {/if}
  {/each}
</span>
