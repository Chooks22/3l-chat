import { parseChatAddAction, parseLiveMetadata, type BannerChat, type Chat, type Metadata } from '$lib/youtube/parser.js'
import type { LiveChatTextMessage } from '@chooks22/youtubei.js/classes'
import { AddChatItemAction, LiveChatPlaceholderItem } from '@chooks22/youtubei.js/classes'
import type { ObservedArray } from '@chooks22/youtubei.js/helpers'
import type { ChatAction, LiveMetadata, VideoInfo } from '@chooks22/youtubei.js/youtube'
import { LiveChat } from '@chooks22/youtubei.js/youtube'
import { get, type Writable } from 'svelte/store'

export interface Stream {
  chats: Writable<Chat[]>
  paids: Writable<BannerChat[]>
  details: Writable<Metadata>
}

export function startChat(videoInfo: VideoInfo, stream: Stream): Promise<() => void> {
  let _paids = get(stream.paids)
  let _chats = get(stream.chats)

  const livechat = new LiveChat(videoInfo)
  console.log('videoInfo = %O', videoInfo)

  const timer = setInterval(() => {
    if (_chats.length > 500) {
      stream.chats.set(_chats = _chats.slice(-500))
    }
    if (_paids.length > 500) {
      stream.paids.set(_paids = _paids.slice(-500))
    }
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

      const chat = parseChatAddAction(action.item, videoInfo.basic_info.channel!.id)
      if (chat === null) {
        console.warn(`[livechat] no parser for item type ${action.item.type}!`, action.item)
        return
      }

      console.debug('[livechat] %s: %O', action.item.type, chat)

      if (chat.type !== 'text') {
        _paids.push(chat)
        stream.paids.set(_paids)
      }

      _chats.push(chat)
      stream.chats.set(_chats)
    }
  })

  livechat.on('metadata-update', (action: LiveMetadata) => {
    const details = parseLiveMetadata(action)
    stream.details.set(details)
  })

  return new Promise(res => {
    console.info('[livechat] starting...')
    livechat.start()

    const prom1 = new Promise<void>(resolve => {
      livechat.on('start', (args: { actions: ObservedArray }) => {
        args.actions.forEach(action => {
          livechat.emit('chat-update', action)
        })
        resolve()
      })
    })

    const prom2 = new Promise<void>(resolve => {
      livechat.once('metadata-update', resolve)
    })

    void Promise.all([prom1, prom2]).then(() => {
      console.info('[livechat] started.')
      res(close)
    })
  })
}
