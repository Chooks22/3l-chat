<script lang="ts">
  import AppBar from "$lib/AppBar.svelte";
  import AppBarItem from "$lib/AppBarItem.svelte";
  import { getContext } from "svelte";
  import type { Readable } from "svelte/store";

  const page = getContext<Readable<number>>("page");
</script>

<AppBar>
  <AppBarItem active={$page === 0} icon="chat" href="#">All Chat</AppBarItem>
  <AppBarItem active={$page === 1} icon="3p" href="#members">
    Members
  </AppBarItem>
  <AppBarItem active={$page === 2} icon="reviews" href="#supers">
    Super Chats
  </AppBarItem>
</AppBar>
