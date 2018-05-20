// @flow

import fetch from 'node-fetch'
import SocketManager from '../../socket'
import Message from '../../models/Message'
import { chatModel, pushTokensModel } from '../mongodb'
import avatarByGid from '../../utils/avatarByGid'
import { decode } from '../../utils/cantor-pairing'
import config from '../../config'

const PUSH_OPTIONS = {
    method: 'POST',
    headers: {
        Authorization: `key=${config.FCM_KEY}`,
        'Content-Type': 'application/json'
    }
}

const BASE_URL = 'https://k1logram-team6.now.sh'

export default class NotificationsAPI {
    static sendMessageNotification(message: Message): Promise<void> {
        const recipient = decode(message.chatId, message.authorGid)
        return recipient
            ? this.sendPersonalNotification(Number(recipient), message)
            : this.sendBroadcastNotification(message)
    }

    static async sendPersonalNotification(recipient: number, message: Message): Promise<void> {
        if (SocketManager.hasClient(recipient)) {
            return null
        }

        const { tokens } = await pushTokensModel.get(recipient)

        return this.sendNotification(tokens, 'Новое личное сообщение', message)
    }

    static async sendBroadcastNotification(message: Message): Promise<void> {
        const { members } = await chatModel.get(message.chatId)

        const response = await Promise.all(members
            .filter(gid => !SocketManager.hasClient(gid))
            .map(gid => pushTokensModel.get(gid).catch(() => [])))

        const tokens = response.map(x => x.tokens).reduce((prev, curr) => [...prev, ...curr], [])

        return this.sendNotification(tokens, 'Новое сообщение в групповом чате', message)
    }

    static sendNotification(tokens: string[], title: string, message: Message): Promise<void> {
        const notification = {
            notification: { title,
                body: message.text ? message.text.slice(0, 150) : '*вложение*',
                icon: `${BASE_URL}/img/kettlebell.png`,
                click_action: `${BASE_URL}/?im=${message.chatId}` // eslint-disable-line
            },
            registration_ids: tokens // eslint-disable-line
        }

        return fetch(config.FCM_PUSH_URL, { ...PUSH_OPTIONS, body: JSON.stringify(notification) })
    }
}
