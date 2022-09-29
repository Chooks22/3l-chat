import { parseChatMessage, type Chat } from '$lib/youtube/parser.js'
import { AddChatItemAction, LiveChatPlaceholderItem, type LiveChatPaidMessage, type LiveChatTextMessage } from '@chooks22/youtubei.js/classes'
import type { ChatAction, VideoInfo } from '@chooks22/youtubei.js/youtube'
import { LiveChat } from '@chooks22/youtubei.js/youtube'
import { get, type Writable } from 'svelte/store'

type RawMessage = LiveChatTextMessage | LiveChatPaidMessage

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

  livechat.on('chat-update', (action: ChatAction) => {
    if (action.is(AddChatItemAction) && action.item) {
      if (action.item.is(LiveChatPlaceholderItem)) {
        return
      }

      const chat = parseChatMessage(action.item as RawMessage)
      console.debug(chat)
      _chats.push(chat)
      chats.set(_chats)
    }
  })

  return new Promise(res => {
    console.info('livechat starting...')
    livechat.start()
    livechat.on('start', () => {
      console.info('livechat started')
      res(close)
    })
  })
}
