<script lang="ts">
  import type { Margins } from "src/routes/+layout.svelte";
  import { afterUpdate, beforeUpdate, getContext, onMount } from "svelte";
  import type { Readable } from "svelte/store";

  export let title: string;
  const margins = getContext<Readable<Margins>>("margins");

  let autoscroll = true;
  let container: HTMLUListElement;

  function scrollToBottom() {
    container.scrollTo({ top: container.scrollHeight });
  }

  beforeUpdate(() => {
    autoscroll =
      Boolean(container) &&
      container.offsetHeight + container.scrollTop >
        container.scrollHeight - 16;
  });

  afterUpdate(() => {
    if (autoscroll) {
      scrollToBottom();
    }
  });

  onMount(scrollToBottom);
</script>

<section class="flex w-screen">
  <h2 hidden>{title}</h2>
  <ul
    class="flex flex-col w-full gap-2 p-2 overflow-y-auto"
    style:height={`calc(100vh - ${$margins.top + $margins.bottom}px)`}
    bind:this={container}
  >
    <slot />
  </ul>
</section>
