<script lang="ts">
  import type { ChatRun } from "$lib/youtube/parser.js";

  export let runs: ChatRun[];
</script>

<span class="space-x-0.5 leading-none break-words">
  {#each runs as run}
    {#if run.type === "emoji"}
      <img
        src={run.value}
        alt={`emoji ${run.id}`}
        class="inline w-6 h-6"
        height="24"
        width="24"
      />
    {:else}
      {run.value}
    {/if}
  {/each}
</span>
