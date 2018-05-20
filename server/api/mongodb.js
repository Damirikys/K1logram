import Cache from 'lru-cache'
import mongoose from 'mongoose'

import config from '../config'

import UserProfile from '../models/UserProfile'
import Chat from '../models/Chat'
import Message from '../models/Message'

const LRUCache: Cache = new Cache({
    max: 100000,
    maxAge: 1000 * 60 * 60
})

class EntityNotFoundError extends Error {}

class Entity<T> {
    name: string
    collection: string
    Model: Object

    constructor(name, collection, schema) {
        this.name = name
        this.collection = collection
        this.Model = mongoose.model(name, schema, collection)
    }

    getAll({ limit, offset, where = {} }): Promise<Array<T>> {
        return this.Model.find(where)
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .exec()
    }

    findAll(key: string, query: string, { limit, offset }): Promise<Array<T>> {
        return this.Model.find()
            .regex(key, new RegExp(query, 'i'))
            .skip(offset)
            .limit(limit)
            .exec()
    }

    async get(_id: number, nocache: boolean): Promise<T> {
        const key = `${this.Model.collection.name}_${_id}`
        const cached = LRUCache.get(key)

        if (cached && !nocache) {
            return cached
        }

        const model: T = await this.Model.findById(_id)

        if (!model) {
            throw new EntityNotFoundError(`${this.constructor.name}: entity with id=${_id} not found`)
        }

        if (nocache) {
            LRUCache.set(key, model)
        }

        return model
    }

    remove(_id: number): Promise<void> {
        LRUCache.del(`${this.Model.collection.name}_${_id}`)
        return this.Model.findById(_id).remove()
    }

    async updateOrCreate(_id: number, obj: T): Promise<void> {
        const model = await this.Model.findById(_id)

        if (!model) {
            const entity = new this.Model(obj)
            return entity.save()
        }

        LRUCache.del(`${this.Model.collection.name}_${_id}`)

        return model.update(obj)
    }

    static create<S>(name, collection, schema) {
        return new class extends Entity<S> {
            constructor() {
                super(name, collection, schema)
            }
        }()
    }
}

export const userModel: Entity<UserProfile> = Entity.create('user', 'users', mongoose.Schema({
    _id: Number,
    user: mongoose.Schema({
        gid: Number,
        name: String,
        bio: String,
        email: String,
        avatar: String
    }),
    contacts: [Number],
    chats: [Number]
}))

export const chatModel: Entity<Chat> = Entity.create('chat', 'chats', mongoose.Schema({
    _id: Number,
    common: mongoose.Schema({
        name: String,
        createdAt: Number
    }),
    owner: Number,
    members: [Number]
}))

export const messageModel: Entity<Message> = Entity.create('message', 'messages', mongoose.Schema({
    _id: Number,
    text: String,
    imgUrl: String,
    chatId: { type: Number, index: true },
    authorGid: Number,
    createdAt: Number,
    reactions: mongoose.Schema.Types.Mixed,
    forwarded: [mongoose.Schema.Types.Mixed],
    geodata: mongoose.Schema.Types.Mixed
}))

export const avatarsModel: Entity<{ data: string }> = Entity.create('avatar', 'avatars', mongoose.Schema({
    _id: Number,
    data: String
}))

export const pushTokensModel: Entity<Message> = Entity.create('pushToken', 'pushTokens', mongoose.Schema({
    _id: Number,
    tokens: [{ type: String, unique: true }]
}))

export const connect = () => mongoose.connect(config.MONGODB_URL, { autoReconnect: true })
export const disconnect = () => mongoose.disconnect()
