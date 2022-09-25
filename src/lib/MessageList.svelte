<script lang="ts">
  import { afterUpdate, onMount } from "svelte";

  export let title: string;

  let inBottom = true;
  let container: HTMLUListElement;
  let span: HTMLSpanElement;

  onMount(() => {
    const io = new IntersectionObserver(([item]) => {
      inBottom = item.isIntersecting;
    });

    io.observe(span);

    return () => io.disconnect();
  });

  function scrollToBottom() {
    container.scrollTo({ top: container.scrollHeight + 1 });
  }

  afterUpdate(() => {
    if (inBottom) {
      scrollToBottom();
    }
  });
</script>

<section class="flex w-screen h-full overflow-hidden">
  <h2 hidden>{title}</h2>
  <ul
    class="flex flex-col w-full h-full gap-2 p-2 overflow-y-auto"
    bind:this={container}
  >
    <slot />
    <div class="pb-1 -mb-2" bind:this={span} />
  </ul>
</section>
