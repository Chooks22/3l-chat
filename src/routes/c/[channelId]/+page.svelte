<script lang="ts">
  import "swiper/css";
  import "./swiper.css";

  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { HashNavigation } from "swiper";
  import { Swiper } from "swiper/svelte";

  import Portal from "svelte-portal";
  import BottomBar from "./BottomBar.svelte";
  import ChatHeader from "./ChatHeader.svelte";
  import MembersChat from "./MembersChat.svelte";
  import NormalChat from "./NormalChat.svelte";
  import SuperChat from "./SuperChat.svelte";

  const idx = setContext("page", writable<number>(0));
</script>

<Portal target="#header">
  <ChatHeader />
</Portal>

<Swiper
  modules={[HashNavigation]}
  class="flex flex-col w-screen"
  hashNavigation={{ replaceState: true, watchState: true }}
  on:slideChange={(e) => ($idx = e.detail[0].realIndex)}
>
  <NormalChat />
  <MembersChat />
  <SuperChat />
</Swiper>

<Portal target="#footer">
  <BottomBar />
</Portal>
