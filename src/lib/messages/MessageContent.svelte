<script lang="ts">
  import type { EmojiRun, TextRun } from "@chooks22/youtubei.js/items";

  export let runs: (TextRun | EmojiRun)[] = [];
</script>

<span class="space-x-0.5 leading-none">
  {#each runs as run}
    {#if "emoji" in run}
      <img src={run.emoji.image[0].url} alt="" class="inline w-6 h-6" />
    {:else}
      {run.text}
    {/if}
  {/each}
</span>
