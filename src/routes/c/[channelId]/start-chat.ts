import { parseChatAddAction, type Chat } from '$lib/youtube/parser.js'
import type { LiveChatTextMessage } from '@chooks22/youtubei.js/classes'
import { AddChatItemAction, LiveChatPlaceholderItem } from '@chooks22/youtubei.js/classes'
import type { ChatAction, VideoInfo } from '@chooks22/youtubei.js/youtube'
import { LiveChat } from '@chooks22/youtubei.js/youtube'
import { get, type Writable } from 'svelte/store'

export function startChat(videoInfo: VideoInfo, chats: Writable<Chat[]>): Promise<() => void> {
  let _chats = get(chats)

  const livechat = new LiveChat(videoInfo)
  console.log('videoInfo = %O', videoInfo)

  const timer = setInterval(() => {
    chats.set(_chats = _chats.slice(-250))
  }, 1000)

  const close = () => {
    clearInterval(timer)
    livechat.stop()
  }

  let i = 0
  const dupes: string[] = []

  const checkDupe = (id: string) => {
    const hasDupe = dupes.includes(id)
    dupes[i] = id
    i = (i + 1) % 9
    return hasDupe
  }

  // eslint-disable-next-line complexity
  livechat.on('chat-update', (action: ChatAction) => {
    if (action.is(AddChatItemAction) && action.item) {
      if (action.item.is(LiveChatPlaceholderItem)) {
        return
      }

      if (checkDupe((action.item as LiveChatTextMessage).id)) {
        console.warn('[livechat] duplicate id detected!')
        return
      }

      const chat = parseChatAddAction(action.item)
      if (chat === null) {
        console.warn(`[livechat] no parser for item type ${action.item.type}!`, action.item)
        return
      }

      console.debug('[livechat] %s: %O', action.item.type, chat)
      _chats.push(chat)
      chats.set(_chats)
    }
  })

  return new Promise(res => {
    console.info('[livechat] starting...')
    livechat.start()
    livechat.on('start', () => {
      console.info('[livechat] started.')
      res(close)
    })
  })
}
