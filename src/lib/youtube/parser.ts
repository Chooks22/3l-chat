import type { MetadataBadge } from '@chooks22/youtubei.js/classes'
import { LiveChatAuthorBadge, LiveChatMembershipItem, LiveChatPaidMessage, LiveChatPaidSticker, LiveChatTextMessage } from '@chooks22/youtubei.js/classes'
import type { YTNode } from '@chooks22/youtubei.js/helpers'
import type { EmojiRun, TextRun } from '@chooks22/youtubei.js/items'

function hexify(color: number) {
  const hex = color.toString(16).slice(2)
  return `#${hex}`
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

export type Chat = TextChat | PaidChat | MemberAdd | StickerAdd

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

function parseAuthor(author: RawAuthor, isMember: boolean): ChatAuthor {
  const badges = isMember ? [] : author.badges as RawBadge[]

  return {
    id: author.id,
    name: author.name.text,
    icon: author.thumbnails.at(-1)!.url,
    isMember: isMember || badges.some(badge => badge.is(LiveChatAuthorBadge)),
    isModerator: !isMember && (author as RawTextMessage['author'])!.is_moderator === true,
    isOwner: false, // @fixme: use channel id from page
    badges: parseBadges(badges),
  }
}

function parseTextMessage(item: LiveChatTextMessage): TextChat {
  return {
    type: 'text',
    id: item.id,
    author: parseAuthor(item.author!, false),
    runs: parseRuns(item.message.runs),
    data: null,
  }
}

function parsePaidMessage(item: LiveChatPaidMessage): PaidChat {
  return {
    type: 'paid',
    id: item.id,
    author: parseAuthor(item.author, false),
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

function parseMemberMessage(item: LiveChatMembershipItem): MemberAdd {
  return {
    type: 'member',
    id: item.id,
    author: parseAuthor(item.author, true),
    runs: [],
    data: {
      subheader: {
        text: item.header_subtext.text,
      },
    },
  }
}

function parseSticker(item: LiveChatPaidSticker): StickerAdd {
  const sticker = item.sticker.at(-1)!
  return {
    type: 'sticker',
    id: item.id,
    author: parseAuthor(item.author, false),
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
export function parseChatAddAction(item: YTNode): Chat | null {
  if (item.is(LiveChatTextMessage)) {
    return parseTextMessage(item)
  }

  if (item.is(LiveChatPaidMessage)) {
    return parsePaidMessage(item)
  }

  if (item.is(LiveChatMembershipItem)) {
    return parseMemberMessage(item)
  }

  if (item.is(LiveChatPaidSticker)) {
    return parseSticker(item)
  }

  return null
}
