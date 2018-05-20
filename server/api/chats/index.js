// @flow

import Chat from '../../models/Chat'
import SocketEvent, { types } from '../../models/SocketEvent'
import socketManager from '../../socket'
import { chatModel } from '../mongodb'

export default class ChatsAPI {
    static fetch(chatId: number): Promise<Chat> {
        return chatModel.get(chatId)
    }

    static update(chat: Chat): Promise<void> {
        return chatModel.updateOrCreate(chat._id, chat).then(() => {
            socketManager.sendEvent(`chat_${chat._id}`, new SocketEvent(types.CHAT_UPDATE, chat))
        })
    }

    static delete(chatId: number): Promise<void> {
        return chatModel.remove(chatId).then(() => {
            socketManager.sendEvent(`chat_${chatId}`, new SocketEvent(types.CHAT_REMOVE, chatId))
        })
    }
}
