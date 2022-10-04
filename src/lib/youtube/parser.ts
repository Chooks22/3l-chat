import type { MetadataBadge } from '@chooks22/youtubei.js/classes'
import { LiveChatAuthorBadge, LiveChatMembershipItem, LiveChatPaidMessage, LiveChatPaidSticker, LiveChatTextMessage } from '@chooks22/youtubei.js/classes'
import type { YTNode } from '@chooks22/youtubei.js/helpers'
import type { EmojiRun, TextRun } from '@chooks22/youtubei.js/items'
import type { Channel, LiveMetadata } from '@chooks22/youtubei.js/youtube'

function hexify(color: number) {
  const hex = color.toString(16).slice(2)
  return `#${hex}`
}

export interface ChannelInfo {
  id: string
  name: string
  icon: {
    best: string
    thumb: string
  }
  subscribers: string
  description: string
  url: string
}

export interface Metadata {
  title: string | undefined
  description: string | undefined
  views: string | undefined
  likes: string | undefined
  date: string | undefined
}

export interface ChatAuthorBadge {
  type: 'icon' | 'custom'
  value: string
  tooltip: string
}

export interface ChatAuthor {
  id: string
  name: string
  icon: string
  isMember: boolean
  isModerator: boolean
  isOwner: boolean
  badges: ChatAuthorBadge[]
}

export interface EmojiChatRun {
  id: string
  type: 'emoji'
  value: string
}

export interface TextChatRun {
  id: null
  type: 'text'
  value: string
}

export type ChatRun = EmojiChatRun | TextChatRun

export interface ChatStyle {
  background: string
  text: string
}

export interface BaseChat {
  id: string
  author: ChatAuthor
  runs: ChatRun[]
}

export interface TextChat extends BaseChat {
  type: 'text'
  data: null
}

export interface PaidChatDetails {
  amount: string
  styles: {
    header: ChatStyle
    body: ChatStyle
  }
}

export interface PaidChat extends BaseChat {
  type: 'paid'
  data: PaidChatDetails
}

export interface MemberAddDetails {
  subheader: {
    text: string
  }
}

export interface MemberAdd extends BaseChat {
  type: 'member'
  data: MemberAddDetails
}

export interface StickerAddDetails {
  stickerUrl: string
  amount: string
  styles: {
    background: string
    author: {
      text: string
    }
    chip: ChatStyle
  }
}

export interface StickerAdd extends BaseChat {
  type: 'sticker'
  data: StickerAddDetails
}

export type BannerChat = PaidChat | MemberAdd | StickerAdd
export type Chat = TextChat | BannerChat

function parseRuns(runs: (TextRun | EmojiRun)[] | undefined): ChatRun[] {
  if (runs === undefined) {
    return []
  }

  return runs.map(run => 'emoji' in run
    ? {
      id: run.emoji.emoji_id,
      type: 'emoji',
      value: run.emoji.image.at(-1)!.url,
    }
    : {
      id: null,
      type: 'text',
      value: run.text,
    })
}

function parseBadges(badges: (LiveChatAuthorBadge | MetadataBadge)[]): ChatAuthorBadge[] {
  return badges.map(badge => badge.is(LiveChatAuthorBadge) && badge.custom_thumbnail !== null
    ? {
      type: 'custom',
      value: badge.custom_thumbnail[0].url,
      tooltip: badge.tooltip!,
    }
    : {
      type: 'icon',
      value: badge.style!,
      tooltip: badge.tooltip!,
    })
}

type RawTextMessage = LiveChatTextMessage | LiveChatPaidMessage
type RawBadge = LiveChatAuthorBadge | MetadataBadge
type RawAuthor = Exclude<(RawTextMessage | LiveChatMembershipItem)['author'], undefined>

function parseAuthor(author: RawAuthor, ownerId: string, isMember: boolean): ChatAuthor {
  const badges = isMember ? [] : author.badges as RawBadge[]

  return {
    id: author.id,
    name: author.name.text,
    icon: author.thumbnails.at(-1)!.url,
    isMember: isMember || badges.some(badge => badge.is(LiveChatAuthorBadge)),
    isModerator: !isMember && (author as RawTextMessage['author'])!.is_moderator === true,
    isOwner: author.id === ownerId,
    badges: parseBadges(badges),
  }
}

function parseTextMessage(item: LiveChatTextMessage, ownerId: string): TextChat {
  return {
    type: 'text',
    id: item.id,
    author: parseAuthor(item.author!, ownerId, false),
    runs: parseRuns(item.message.runs),
    data: null,
  }
}

function parsePaidMessage(item: LiveChatPaidMessage, ownerId: string): PaidChat {
  return {
    type: 'paid',
    id: item.id,
    author: parseAuthor(item.author, ownerId, false),
    runs: parseRuns(item.message.runs),
    data: {
      amount: item.purchase_amount,
      styles: {
        header: {
          text: hexify(item.header_text_color),
          background: hexify(item.header_background_color),
        },
        body: {
          text: hexify(item.body_text_color),
          background: hexify(item.body_background_color),
        },
      },
    },
  }
}

function parseMemberMessage(item: LiveChatMembershipItem, ownerId: string): MemberAdd {
  return {
    type: 'member',
    id: item.id,
    author: parseAuthor(item.author, ownerId, true),
    runs: [],
    data: {
      subheader: {
        text: item.header_subtext.text,
      },
    },
  }
}

function parseSticker(item: LiveChatPaidSticker, ownerId: string): StickerAdd {
  const sticker = item.sticker.at(-1)!
  return {
    type: 'sticker',
    id: item.id,
    author: parseAuthor(item.author, ownerId, false),
    runs: [],
    data: {
      stickerUrl: sticker.url,
      amount: item.purchase_amount,
      styles: {
        background: hexify(item.background_color),
        author: {
          text: hexify(item.author_name_text_color),
        },
        chip: {
          text: hexify(item.money_chip_text_color),
          background: hexify(item.money_chip_background_color),
        },
      },
    },
  }
}

// eslint-disable-next-line complexity
export function parseChatAddAction(item: YTNode, ownerId: string): Chat | null {
  try {
    if (item.is(LiveChatTextMessage)) {
      return parseTextMessage(item, ownerId)
    }

    if (item.is(LiveChatPaidMessage)) {
      return parsePaidMessage(item, ownerId)
    }

    if (item.is(LiveChatMembershipItem)) {
      return parseMemberMessage(item, ownerId)
    }

    if (item.is(LiveChatPaidSticker)) {
      return parseSticker(item, ownerId)
    }

    return null
  } catch (e) {
    console.error(e, item)
    return null
  }
}

export function parseChannel(channel: Channel): ChannelInfo {
  const metadata = channel.metadata
  const { author, subscribers } = channel.header

  return {
    id: author.id,
    name: author.name,
    icon: {
      best: author.thumbnails[0].url,
      thumb: author.thumbnails.at(-1)!.url,
    },
    subscribers: subscribers.text,
    description: metadata.description,
    url: metadata.vanity_channel_url,
  }
}

export function parseLiveMetadata(metadata: LiveMetadata): Metadata {
  return {
    title: metadata.title?.title.text,
    description: metadata.description?.description.text,
    likes: metadata.likes?.default_text,
    views: metadata.views?.view_count.text,
    date: metadata.date?.date_text,
  }
}
