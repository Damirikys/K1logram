// @flow

import LRUCache from 'lru-cache'
import metascraper from 'metascraper'
import got from 'got'

import * as hrudb from '../hrudb'
import Event, { types as eventTypes, filters } from '../../models/Event'
import Message from '../../models/Message'
import SocketEvent, { types as socketEventTypes } from '../../models/SocketEvent'

import socketManager from '../../socket'

const CACHE_LIMIT_SIZE: number = 100 * 100 * 100
const MESSAGES_PER_PAGE: number = 50

type CacheType = {
    clustersCount: number,
    messagesCount: number
}

const clusterCache: LRUCache<number, CacheType> = new LRUCache(CACHE_LIMIT_SIZE)

export default class MessagesAPI {
    static async fetch(chatId: number, clusterId?: number): Promise<Array<Message>> {
        const cache: CacheType = clusterCache.get(chatId)

        return (cache) ?
            this._fetchMessages(chatId, clusterId, cache.clustersCount) :
            this._fetchNoCached(chatId, clusterId)
    }

    static async add(message: Message): Promise<void> {
        const cache: CacheType = clusterCache.get(String(message.chatId))
        const [chatId, clustersCount] = [message.chatId, cache.clustersCount]
        cache.messagesCount++

        message.clusterId = cache.clustersCount

        if (cache.messagesCount === MESSAGES_PER_PAGE) {
            cache.clustersCount++
            cache.messagesCount = 0

            hrudb.update(`events${message.chatId}_cluster`, `${cache.clustersCount}`)
        }

        const event: Event = new Event(eventTypes.NEW_MESSAGE, message)
        return this._addEvent(chatId, clustersCount, event)
    }

    static async edit(message: Message): Promise<void> {
        const event: Event = new Event(eventTypes.EDIT_MESSAGE, message)
        return this._addEvent(message.chatId, message.clusterId, event)
    }

    static async delete(message: Message): Promise<void> {
        const event: Event = new Event(eventTypes.DELETE_MESSAGE, message)
        return this._addEvent(message.chatId, message.clusterId, event)
    }

    static async getMeta(targetUrl: string): Promise<Object> {
        const { body: html, url } = await got(targetUrl)
        return metascraper({ html, url })
    }

    static async _addEvent(chatId: number, clusterId: number, event: Event): Promise<void> {
        return hrudb.add(`events${chatId}_${clusterId}`, JSON.stringify(event)).then(() => {
            socketManager.sendEvent(`chat_${chatId}`, new SocketEvent(socketEventTypes.CHAT_EVENT, event))
        })
    }

    static async _fetchNoCached(chatId: number, clusterId?: number): Promise<Array<Message>> {
        const clustersCount: number = await this._fetchClusterCount(chatId)
        return this._fetchMessages(chatId, clusterId, clustersCount)
    }

    static async _fetchClusterCount(chatId: number): Promise<number> {
        try {
            return Number(await hrudb.get(`events${chatId}_cluster`))
        } catch (e) {
            hrudb.update(`events${chatId}_cluster`, `${1}`)
            return 1
        }
    }

    static async _fetchMessages(chatId: number, clusterId?: number, clustersCount: number): Promise<Array<Message>> {
        const eventsRaw: string = await hrudb.getAll(`events${chatId}_${clusterId || clustersCount}`)
        const events: Array<Event> = JSON.parse(eventsRaw).map(event => JSON.parse(event))

        const editedDict: Object = events
            .filter(filters.isEditing)
            .map(event => event.payload)
            .reduce((res, cur) => ({ ...res, [cur.createdAt]: cur }), {})

        const deletedDict: Object = events
            .filter(filters.isDeleting)
            .map(event => event.payload)
            .reduce((res, cur) => ({ ...res, [cur]: true }), {})

        const messageEvents: Array<Event> = events.filter(filters.isMessage)

        if (!clusterCache.has(chatId)) {
            const cached: CacheType = { clustersCount, messagesCount: messageEvents.length }
            clusterCache.set(chatId, cached)
        }

        return messageEvents
            .map(event => event.payload)
            .filter(message => !deletedDict[message.createdAt])
            .map(message => editedDict[message.createdAt] || message)
    }
}
