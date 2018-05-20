// @flow

import metascraper from 'metascraper'
import got from 'got'
import base64ToImage from 'base64-to-image'
import Event, { types as eventTypes } from '../../models/Event'
import Message from '../../models/Message'
import { messageModel } from '../mongodb'
import SocketEvent, { types as socketEventTypes } from '../../models/SocketEvent'
import rootPath from 'app-root-path'

import NotificationAPI from '../notifications'
import socketManager from '../../socket'

type OptionsType = {
    limit: number,
    offset: number
}

export default class MessagesAPI {
    static fetch(chatId: number, options?: OptionsType = { limit: 50, offset: 0 }): Promise<Array<Message>> {
        return messageModel.getAll({ ...options, where: { chatId } })
    }

    static add(message: Message): Promise<void> {
        return messageModel.updateOrCreate(message._id, message).then(() => {
            socketManager.sendEvent(`chat_${message.chatId}`,
                new SocketEvent(socketEventTypes.CHAT_EVENT, new Event(eventTypes.NEW_MESSAGE, message))
            )

            NotificationAPI.sendMessageNotification(message)
        })
    }

    static edit(message: Message): Promise<void> {
        return messageModel.updateOrCreate(message._id, message).then(() => {
            socketManager.sendEvent(`chat_${message.chatId}`,
                new SocketEvent(socketEventTypes.CHAT_EVENT, new Event(eventTypes.EDIT_MESSAGE, message))
            )
        })
    }

    static delete(message: Message): Promise<void> {
        return message // TODO delete
    }

    static async getMeta(targetUrl: string): Promise<Object> {
        const { body: html, url } = await got(targetUrl)
        return metascraper({ html, url })
    }

    static async uploadImage(file: string): Promise<string> {
        const time = Date.now()
        const path = `${rootPath}/static/images/`
        const optionalObj = { fileName: `${time}`, type: 'jpg' }
        base64ToImage(file, path, optionalObj)

        return `/images/${time}.jpg`
    }
}
