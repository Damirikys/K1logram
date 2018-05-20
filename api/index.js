// @flow

import fetch from 'isomorphic-unfetch'
import FormData from 'form-data'

import UserProfile from '../server/models/UserProfile'
import UserInfo from '../server/models/UserInfo'
import Chat from '../server/models/Chat'
import ChatInfo from '../server/models/ChatInfo'
import Message from '../server/models/Message'

export const BASE_URL = '/api/v1'
export const BASE_OPTIONS = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
}

export default class APIClient {
    static async fetchSelf(): Promise<UserProfile> {
        const response = await fetch(`${BASE_URL}/user`, BASE_OPTIONS)
        return response.json()
    }

    static async updateSelf(user: UserInfo): Promise<void> {
        return fetch(`${BASE_URL}/user`, {...BASE_OPTIONS,
            method: 'PATCH',
            body: JSON.stringify(user)
        })
    }

    static async fetchContacts(gids: Array<number>): Promise<Object> {
        const response = await fetch(`${BASE_URL}/users`, {...BASE_OPTIONS,
            method: 'POST',
            body: JSON.stringify(gids)
        })

        return response.json()
    }

    static async findContacts(name: string): Promise<Array<UserInfo>> {
        const response = await fetch(`${BASE_URL}/contacts?name=${name}`, BASE_OPTIONS)
        return response.json()
    }

    static async addContacts(gids: Array<number>): Promise<Array<UserInfo>> {
        return fetch(`${BASE_URL}/contacts`, {...BASE_OPTIONS,
            method: 'PUT',
            body: JSON.stringify(gids)
        })
    }

    static async removeContacts(gids: Array<number>): Promise<Array<UserInfo>> {
        return fetch(`${BASE_URL}/contacts`, {...BASE_OPTIONS,
            method: 'DELETE',
            body: JSON.stringify(gids)
        })
    }

    static async fetchChats(ids: Array<number>): Promise<Object> {
        const response = await fetch(`${BASE_URL}/chats`, {...BASE_OPTIONS,
            method: 'POST',
            body: JSON.stringify(ids)
        })

        return response.json()
    }

    static async fetchChat(id: number): Promise<Chat> {
        const response = await fetch(`${BASE_URL}/chats/${id}`, BASE_OPTIONS)
        return response.json()
    }

    static async createChat(chat: Chat): Promise<void> {
        return fetch(`${BASE_URL}/chats`, {...BASE_OPTIONS,
            method: 'PUT',
            body: JSON.stringify(chat)
        })
    }

    static async removeChat(id: number): Promise<void> {
        return fetch(`${BASE_URL}/chat/${id}`, {...BASE_OPTIONS,
            method: 'DELETE'
        })
    }

    static async updateChatInfo(chatInfo: ChatInfo): Promise<void> {
        return fetch(`${BASE_URL}/chat`, {...BASE_OPTIONS,
            method: 'PATCH',
            body: JSON.stringify(chatInfo)
        })
    }

    static async addMemberToChat(chatId: number, gid: number): Promise<void> {
        return fetch(`${BASE_URL}/chat/${chatId}/members`, {...BASE_OPTIONS,
            method: 'PUT',
            body: JSON.stringify({ gid })
        })
    }

    static async removeMemberFromChat(chatId: number, gid: number): Promise<void> {
        return fetch(`${BASE_URL}/chat/${chatId}/members`, {...BASE_OPTIONS,
            method: 'DELETE',
            body: JSON.stringify({ gid })
        })
    }

    static async fetchAllMessages(ids: Array<number>): Promise<Array<Message>> {
        const response = await fetch(`${BASE_URL}/messages`, {...BASE_OPTIONS,
            method: 'POST',
            body: JSON.stringify(ids)
        })

        return response.json()
    }

    static async fetchMessages(chatId: number, clusterId: number): Promise<Array<Message>> {
        const response = await fetch(`${BASE_URL}/messages/${chatId}?clusterId=${clusterId}`, BASE_OPTIONS)
        return response.json()
    }

    static async addMessage(message: Message): Promise<void> {
        return fetch(`${BASE_URL}/messages/${message.chatId}`, {...BASE_OPTIONS,
            method: 'PUT',
            body: JSON.stringify(message)
        })
    }

    static async editMessage(message: Message): Promise<void> {
        return fetch(`${BASE_URL}/messages`, {...BASE_OPTIONS,
            method: 'PATCH',
            body: JSON.stringify(message)
        })
    }

    static async deleteMessage(message: Message): Promise<void> {
        return fetch(`${BASE_URL}/messages`, {...BASE_OPTIONS,
            method: 'DELETE',
            body: JSON.stringify(message)
        })
    }

    static async fetchMeta(url: string): Promise<Object> {
        const response = await fetch(`${BASE_URL}/messages/meta`, {...BASE_OPTIONS,
            method: 'POST',
            body: JSON.stringify({ url })
        })

        return response.json()
    }

    static async uploadAvatar(gid: number, image: Object): Promise<Object> {
        const formData: FormData = new FormData()
        formData.append('avatar', image)

        return fetch(`${BASE_URL}/user/${gid}/avatar`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
    }
}
