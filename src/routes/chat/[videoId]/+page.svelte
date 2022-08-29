<script lang="ts">
  import { page } from "$app/stores";
  import { getContext, onDestroy, onMount, tick } from "svelte";
  import type { Readable } from "svelte/store";
  import type { Innertube } from "youtubei.js";
  import LiveChat from "youtubei.js/dist/src/parser/youtube/LiveChat";

  const { videoId } = $page.params;

  interface Thumbnail {
    url: string;
    width: number;
    height: number;
  }

  interface Badge {
    type: "LiveChatAuthorBadge";
    tooltip: string;
    custom_thumbnail: Image[];
  }

  interface LiveChatAuthorName {
    text: string;
  }

  interface LiveChatAuthor {
    badges: Badge[];
    id: string;
    is_moderator: boolean;
    is_verified: boolean;
    is_verified_artist: boolean;
    name: LiveChatAuthorName;
    thumbnails: Thumbnail[];
  }

  interface Image {
    url: string;
    width: number;
    height: number;
  }

  interface TextRun {
    text: string;
  }

  interface EmojiRunData {
    emoji_id: string;
    shortcuts: string[];
    search_terms: string[];
    image: Image[];
  }

  interface EmojiRun extends TextRun {
    emoji: EmojiRunData;
  }

  interface LiveChatMessage {
    runs: (TextRun | EmojiRun)[];
    text: string;
    timestamp: number;
  }

  interface LiveChatTextMessage {
    id: string;
    type: "LiveChatTextMessage";
    author: LiveChatAuthor;
    message: LiveChatMessage;
    timestamp: number;
  }

  const it = getContext<Readable<Innertube>>("yt");
  let messages: LiveChatTextMessage[] = [];

  interface AddChatItemAction {
    type: "AddChatItemAction";
    item: LiveChatTextMessage;
  }

  let livechat: LiveChat;
  let list: HTMLUListElement;

  // @fixme: reactive scroll
  let inBottom = true;

  async function start() {
    console.info("getting video");
    const info = await $it.getInfo(videoId);
    livechat = new LiveChat(info);

    livechat.on("start", () => console.info("livechat started"));
    livechat.on("chat-update", (action: AddChatItemAction) => {
      if (action.type !== "AddChatItemAction") {
        console.debug("unknown action", action);
        return;
      }

      // @todo: super chats
      if (action.item.type !== "LiveChatTextMessage") {
        console.debug("unknown item", action.item);
        return;
      }

      const item = action.item;
      messages.push(item);
      messages = inBottom ? messages.slice(-250) : messages;
    });

    livechat.start();
  }

  onMount(start);
  onDestroy(() => livechat?.stop());

  $: if (messages.length > 0) {
    inBottom = list.clientHeight + list.scrollTop === list.scrollHeight;
    if (inBottom) scrollToBottom();
  }

  async function scrollToBottom() {
    await tick();
    (list.lastChild as HTMLLIElement).scrollIntoView();
    inBottom = true;
  }
</script>

{#if !inBottom}
  <button
    class="fixed w-10 h-10 text-3xl bg-purple-500 rounded-full bottom-2 font-icon text-neutral-100 right-2"
    on:click={scrollToBottom}
  >
    arrow_downward
  </button>
{/if}

<ul
  class="flex flex-col w-full h-full gap-2 p-2 overflow-y-auto"
  bind:this={list}
>
  {#each messages as node}
    <li class="align-middle">
      <span class="author">
        {#each node.author.badges as badge}
          {@const thumbnail = badge.custom_thumbnail[0]}
          <img class="inline" src={thumbnail.url} alt={badge.tooltip} />
        {/each}
        <span class="font-semibold text-green-600">
          {node.author.name.text}
        </span>
      </span>
      <span>
        {#each node.message.runs as run}
          {#if "emoji" in run && run.emoji.image.length > 1}
            {@const image = run.emoji.image.at(-1)}
            {#if image}
              <!-- this should always be true, we just need this to silence warnings -->
              <img
                class="inline mr-1"
                src={image.url}
                height={image.height}
                width={image.width}
                alt={run.emoji.emoji_id}
              />
            {/if}
          {:else}
            {run.text}
          {/if}
        {/each}
      </span>
    </li>
  {/each}
</ul>

<style>
  .author > span::after {
    @apply content-[':'] text-neutral-300 font-normal mr-1;
  }
</style>
