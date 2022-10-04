<script lang="ts">
  import type { ChatAuthor } from "$lib/youtube/parser.js";

  export let author: ChatAuthor;
  export let colorize = false;
</script>

<span class="mr-2">
  <span
    class="font-bold rounded-sm"
    class:formatted={colorize}
    class:member={author.isMember}
    class:moderator={author.isModerator}
    class:owner={author.isOwner}
  >
    {author.name}
  </span>
  {#if author.isModerator}
    <!-- @todo: handle icon automatically -->
    <span class="font-icon text-blue-500">build</span>
  {/if}
  {#each author.badges as badge}
    {#if badge.type === "custom"}
      <img
        src={badge.value}
        alt={badge.tooltip}
        class="inline-block w-6 h-6 mb-1"
        width="24"
        height="24"
      />
    {/if}
  {/each}
</span>

<style>
  .formatted.member {
    @apply text-green-500;
  }
  .formatted.moderator {
    @apply text-blue-500;
  }
  .formatted.owner {
    @apply px-1 bg-yellow-500 text-neutral-900;
  }
  .formatted.owner::after {
    content: "check";
    @apply font-icon align-middle;
  }
</style>
