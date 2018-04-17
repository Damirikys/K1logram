// @flow

import { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status-codes'

import ChatsAPI from '../api/chats'
import UserAPI from '../api/user'

import Chat from '../models/Chat'
import ChatInfo from '../models/ChatInfo'
import UserProfile from '../models/UserProfile'

export const fetchChat = async ({ params: { id } }: {
    params: { id: string }
}, res: Object) => {
    try {
        const chat: Chat = await ChatsAPI.fetch(Number(id))

        return res.status(OK).json(chat)
    } catch (e) {
        return res.sendStatus(NOT_FOUND)
    }
}

export const fetchAllChats = async ({ body: ids }: {
    ids: Array<number>,
    body: Object
}, res: Object) => {
    try {
        const fetchedChats: Array<Chat> = await Promise.all(ids.map(ChatsAPI.fetch))
        const response: Object = fetchedChats.filter(x => Boolean(x))
            .reduce((result, chat) => ({ ...result, [chat.common.id]: chat }), {})

        return res.status(OK).json(response)
    } catch (e) {
        return res.sendStatus(NOT_FOUND)
    }
}

export const createChat = async ({ user, body: chat }: {
    user: UserProfile,
    chat: Chat,
    body: Chat
}, res: Object) => {
    try {
        chat.owner = user.user.gid

        const assignChatToMembers: Promise<void[]> = Promise.all(
            chat.members.map(gid => UserAPI.fetch(gid)
                .then(profile => {
                    const index = profile.chats.findIndex(id => id === chat.common.id)

                    if (index === -1) {
                        profile.chats.push(chat.common.id)
                    } else {
                        profile.chats[index] = chat.common.id
                    }

                    return UserAPI.update(profile)
                })
            )
        )

        await Promise.all([ChatsAPI.update(chat), assignChatToMembers])

        user.chats.push(chat.common.id)

        return res.sendStatus(OK)
    } catch (e) {
        return res.sendStatus(INTERNAL_SERVER_ERROR)
    }
}

export const updateChatInfo = async ({ body }: {
    user: UserProfile,
    body: ChatInfo
}, res: Object) => {
    try {
        const chat: Chat = await ChatsAPI.fetch(body.id)
        chat.common = body

        await ChatsAPI.update(chat)

        return res.sendStatus(OK)
    } catch (e) {
        return res.sendStatus(INTERNAL_SERVER_ERROR)
    }
}

export const addMemberToChat = async ({ params: { id }, body: { gid } }: {
    params: { id: string },
    body: { gid: number }
}, res: Object) => {
    try {
        const chat: Chat = await ChatsAPI.fetch(Number(id))
        chat.members = [...chat.members, gid]

        const profileUpdate: Promise<void> = UserAPI.fetch(gid).then(profile => {
            profile.chats.push(chat.common.id)
            return UserAPI.update(profile)
        })

        await Promise.all([ChatsAPI.update(chat), profileUpdate])

        return res.sendStatus(OK)
    } catch (e) {
        return res.sendStatus(INTERNAL_SERVER_ERROR)
    }
}

export const deleteMemberFromChat = async ({ params: { id }, body: { gid } }: {
    params: { id: string },
    body: { gid: number }
}, res: Object) => {
    try {
        const chat: Chat = await ChatsAPI.fetch(Number(id))
        chat.members = chat.members.filter(member => member !== gid)

        const profileUpdate: Promise<void> = UserAPI.fetch(gid).then(profile => {
            profile.chats = profile.chats.filter(chatId => chatId !== chat.common.id)

            return UserAPI.update(profile)
        })

        await Promise.all([ChatsAPI.update(chat), profileUpdate])

        return res.sendStatus(OK)
    } catch (e) {
        return res.sendStatus(INTERNAL_SERVER_ERROR)
    }
}

export const deleteChat = async ({ user, params: { id } }: {
    user: UserProfile,
    params: { id: string }
}, res: Object) => {
    try {
        const chat: Chat = await ChatsAPI.fetch(Number(id))

        const isNotRemovedChat = id => id !== chat.common.id

        const removeChatFromUserProfile = async (gid: number): Promise<void> => {
            const profile: UserProfile = await UserAPI.fetch(gid)
            profile.chats = profile.chats.filter(isNotRemovedChat)

            return UserAPI.update(profile)
        }

        await Promise.all([
            ChatsAPI.delete(chat.common.id),
            ...chat.members.map(removeChatFromUserProfile)
        ])

        user.chats = user.chats.filter(isNotRemovedChat)

        return res.sendStatus(OK)
    } catch (e) {
        return res.sendStatus(INTERNAL_SERVER_ERROR)
    }
}
