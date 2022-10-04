<script lang="ts">
  export let icon: string;
  export let href: string;
  export let active = false;
  export let replaceState = false;

  function redirect(e: MouseEvent) {
    if (replaceState) {
      e.preventDefault();
      location.replace(href);
    }
  }
</script>

<li class="w-full h-full">
  <a
    {href}
    class="flex flex-col items-center justify-center w-full h-full"
    on:click={redirect}
  >
    <span
      class="text-2xl leading-none font-icon-outlined"
      class:font-icon={active}
    >
      {icon}
    </span>
    <span class="text-sm">
      <slot />
    </span>
  </a>
</li>
