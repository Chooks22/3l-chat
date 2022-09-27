import { LiveChatAuthorBadge, LiveChatPaidMessage, type LiveChatTextMessage } from '@chooks22/youtubei.js/classes'

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

export interface EmojiChatRUn {
  id: string
  type: 'emoji'
  value: string
}

export interface TextChatRun {
  id: null
  type: 'text'
  value: string
}

export type ChatRun = EmojiChatRUn | TextChatRun

export interface PaidChatStyle {
  background: string
  text: string
}

export interface PaidChatDetails {
  amount: string
  styles: {
    header: PaidChatStyle
    body: PaidChatStyle
  }
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

export interface PaidChat extends BaseChat {
  type: 'paid'
  data: PaidChatDetails
}

export type Chat = TextChat | PaidChat

export function parseChatMessage(item: LiveChatTextMessage | LiveChatPaidMessage): Chat {
  const author = item.author!
  const message = item.message

  const isPaid = item.is(LiveChatPaidMessage)

  return {
    type: isPaid ? 'paid' : 'text',
    id: item.id,
    author: {
      id: author.id,
      name: author.name.text,
      icon: author.thumbnails[0].url,
      isMember: author.badges.some(badge => badge.is(LiveChatAuthorBadge)),
      isModerator: author.is_moderator === true,
      isOwner: false, // @fixme: use channel id from page
      badges: author.badges.map(badge => badge.is(LiveChatAuthorBadge) && badge.custom_thumbnail !== null
        ? {
          type: 'custom',
          value: badge.custom_thumbnail[0].url,
          tooltip: badge.tooltip!,
        }
        : {
          type: 'icon',
          value: badge.style!,
          tooltip: badge.tooltip!,
        }),
    },
    runs: message.runs?.map(run => 'emoji' in run
      ? {
        id: run.emoji.emoji_id,
        type: 'emoji',
        value: (run.emoji.image[1] ?? run.emoji.image[0]).url,
      }
      : {
        id: null,
        type: 'text',
        value: run.text,
      }) ?? [],
    data: isPaid
      ? {
        amount: item.purchase_amount,
        styles: {
          header: {
            background: hexify(item.header_background_color),
            text: hexify(item.header_text_color),
          },
          body: {
            background: hexify(item.body_background_color),
            text: hexify(item.body_text_color),
          },
        },
      }
      : null,
  } as Chat
}
