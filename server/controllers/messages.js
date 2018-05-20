// @flow

import { INTERNAL_SERVER_ERROR, OK } from 'http-status-codes'
import Message from '../models/Message'
import MessagesAPI from '../api/messages'
import UserProfile from '../models/UserProfile'

export const addMessage = async ({ user, body }: {
    user: UserProfile,
    body: Message
}, res: Object) => {
    try {
        const message = new Message(body)
        message.setAuthorGid(user.user.gid)

        await MessagesAPI.add(body)

        return res.sendStatus(OK)
    } catch (e) {
        return res.status(INTERNAL_SERVER_ERROR).send(e)
    }
}

export const fetchMessages = async ({ params: { chatId }, query: { limit, offset } }: {
    params: { chatId: string },
    query: {
        limit?: string,
        offset?: string
    }
}, res: Object) => {
    try {
        const options = {
            limit: Number(limit) || undefined,
            offset: Number(offset) || undefined
        }

        const messages: Array<Message> = await MessagesAPI.fetch(Number(chatId), options)

        return res.status(OK).json(messages)
    } catch (e) {
        return res.sendStatus(INTERNAL_SERVER_ERROR)
    }
}

export const fetchAllMessages = async ({ body: ids }: {
    ids: Array<number>
}, res: Object) => {
    try {
        const response: Object = {}
        await Promise.all(ids.map(id => MessagesAPI.fetch(id)
            .then(messages => response[id] = messages.reverse())))

        return res.status(OK).json(response)
    } catch (e) {
        return res.sendStatus(INTERNAL_SERVER_ERROR)
    }
}

export const editMessage = async ({ body }: {
    body: Message,
}, res: Object) => {
    try {
        await MessagesAPI.edit(body)

        return res.sendStatus(OK)
    } catch (e) {
        return res.status(INTERNAL_SERVER_ERROR).send(e)
    }
}

export const deleteMessage = async ({ body }: {
    body: Message
}, res: Object) => {
    try {
        await MessagesAPI.delete(body)

        return res.sendStatus(OK)
    } catch (e) {
        return res.status(INTERNAL_SERVER_ERROR).send(e)
    }
}

export const getMeta = async ({ body: { url } }: {
    body: { url: string },
}, res: Object) => {
    try {
        const metaData: Object = await MessagesAPI.getMeta(url)
        return res.status(OK).json(metaData)
    } catch (e) {
        return res.sendStatus(INTERNAL_SERVER_ERROR)
    }
}

export const uploadImage = async ({ body: file }: {
    file: string,
    body: string,
}, res: Object) => {
    try {
        return res.status(OK).json({
            url: await MessagesAPI.uploadImage(file)
        })
    } catch (e) {
        return res.sendStatus(INTERNAL_SERVER_ERROR)
    }
}

