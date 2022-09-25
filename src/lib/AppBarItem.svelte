<script lang="ts">
  export let icon: string;
  export let href: string;
  export let active = false;
</script>

<li on:click class="w-full h-full">
  <a {href} class="flex flex-col items-center justify-center w-full h-full">
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
