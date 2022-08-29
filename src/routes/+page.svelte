<script lang="ts">
  import { goto } from "$app/navigation";

  // @todo: login

  const ytUrlRe =
    /^(?:https?:\/\/(?:www\.youtube\.com\/watch\?v=|youtu\.be\/))?([\w-]{11})$/i;

  let value: string;
  $: videoId = ytUrlRe.exec(value)?.[1];

  function redirect() {
    // @todo: use account instead
    if (videoId) goto(`/chat/${videoId}`);
  }
</script>

<!-- @todo: user friendly landing page -->
<form on:submit|preventDefault={redirect}>
  <input
    class="bg-neutral-700"
    type="text"
    placeholder="Video URL"
    bind:value
  />
  <button type="submit">Go to Video</button>
</form>
