// @flow

import * as hrudb from '../hrudb'
import Chat from '../../models/Chat'
import SocketEvent, { types } from '../../models/SocketEvent'
import socketManager from '../../socket'

export default class ChatsAPI {
    static async fetch(chatId: number): Promise<Chat> {
        const chatRaw: string = await hrudb.get(`chat${chatId}`)
        return JSON.parse(chatRaw)
    }

    static async update(chat: Chat): Promise<void> {
        return hrudb.update(`chat${chat.common.id}`, JSON.stringify(chat)).then(() => {
            socketManager.sendEvent(`chat_${chat.common.id}`, new SocketEvent(types.CHAT_UPDATE, chat))
        })
    }

    static async delete(chatId: number): Promise<void> {
        return hrudb.remove(`chat${chatId}`).then(() => {
            socketManager.sendEvent(`chat_${chatId}`, new SocketEvent(types.CHAT_REMOVE, chatId))
        })
    }
}
