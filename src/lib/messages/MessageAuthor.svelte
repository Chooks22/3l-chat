<script lang="ts">
  import LiveChatAuthorBadge from "youtubei.js/dist/src/parser/classes/LiveChatAuthorBadge";
  import type MetadataBadge from "youtubei.js/dist/src/parser/classes/MetadataBadge";
  import type Text from "youtubei.js/dist/src/parser/classes/misc/Text";
  import type Thumbnail from "youtubei.js/dist/src/parser/classes/misc/Thumbnail";

  interface LiveChatAuthor {
    id: string;
    name: Text;
    thumbnails: Thumbnail[];
    badges: LiveChatAuthorBadge[] | MetadataBadge[];
    is_moderator: boolean | null;
    is_verified: boolean | null;
    is_verified_artist: boolean | null;
  }

  export let author: LiveChatAuthor;
  export let colorize = false;
</script>

<span class="mr-2">
  <span
    class="font-bold"
    class:text-green-500={colorize && author.badges.length > 0}
    class:text-blue-500={colorize && author.is_moderator}
  >
    {author.name}
  </span>
  {#if author.is_moderator}
    <span class="text-blue-500 font-icon">build</span>
  {/if}
  {#each author.badges as badge}
    {#if badge.is(LiveChatAuthorBadge) && badge.custom_thumbnail}
      <img
        src={badge.custom_thumbnail[0].url}
        alt={badge.tooltip}
        class="inline-block mb-1"
      />
    {/if}
  {/each}
</span>
