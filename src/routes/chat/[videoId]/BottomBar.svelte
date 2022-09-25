<script lang="ts">
  import AppBar from "$lib/AppBar.svelte";
  import AppBarItem from "$lib/AppBarItem.svelte";

  export let idx: number;
</script>

<AppBar>
  <AppBarItem active={idx === 0} icon="chat" href="#">All Chat</AppBarItem>
  <AppBarItem active={idx === 1} icon="3p" href="#members">Members</AppBarItem>
  <AppBarItem active={idx === 2} icon="reviews" href="#supers">
    Super Chats
  </AppBarItem>
</AppBar>
