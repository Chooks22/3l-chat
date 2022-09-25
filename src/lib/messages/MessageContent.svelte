<script lang="ts">
  import type EmojiRun from "youtubei.js/dist/src/parser/classes/misc/EmojiRun";
  import type TextRun from "youtubei.js/dist/src/parser/classes/misc/TextRun";

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
