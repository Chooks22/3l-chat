<script lang="ts">
  import { Grid } from "svelte-loaders";
  import { fade } from "svelte/transition";

  export let message = "Loading...";
</script>

<div
  out:fade={{ duration: 250 }}
  class="bg-neutral-900 fixed top-0 left-0 z-50 flex items-center w-full h-full"
>
  <div class="relative flex justify-center w-full space-y-2">
    <Grid color="#a855f7" />
    <span class="top-full text-neutral-200 absolute text-xl">{message}</span>
  </div>
</div>
