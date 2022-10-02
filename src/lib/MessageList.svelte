<script lang="ts">
  import { afterUpdate, beforeUpdate, getContext } from "svelte";
  import type { Readable } from "svelte/store";

  interface Margins {
    top: number;
    bottom: number;
  }

  export let title: string;
  const margins = getContext<Readable<Margins>>("margins");

  let autoscroll = true;
  let container: HTMLUListElement;

  beforeUpdate(() => {
    autoscroll =
      Boolean(container) &&
      container.offsetHeight + container.scrollTop >
        container.scrollHeight - 16;
  });

  afterUpdate(() => {
    if (autoscroll) {
      container.scrollTo({ top: container.scrollHeight });
    }
  });
</script>

<section class="flex w-screen">
  <h2 hidden>{title}</h2>
  <ul
    class="flex flex-col w-full gap-2 p-2 overflow-y-auto"
    style:height={`calc(100vh - ${$margins.bottom}px)`}
    bind:this={container}
  >
    <slot />
  </ul>
</section>
