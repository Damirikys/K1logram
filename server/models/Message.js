// @flow

import computeId from '../utils/cantor-pairing'

interface MessageType {
    _id: number,
    chatId: number,
    text: string,
    imgUrl: string,
    authorGid: number,
    createdAt: number,
    reactions: Object,
    forwarded: Object[],
    geodata: Object
}

export default class Message implements MessageType {
    _id: number
    chatId: number
    text: string
    imgUrl: string
    authorGid: number
    createdAt: number
    reactions: Object
    forwarded: Object[]
    geodata: Object

    constructor({ text, imgUrl, chatId, reactions = {}, authorGid, createdAt = Date.now(), forwarded = [], geodata = null }: MessageType) {
        this._id = computeId(authorGid + chatId, createdAt)
        this.text = text
        this.imgUrl = imgUrl
        this.chatId = chatId
        this.createdAt = createdAt
        this.reactions = reactions
        this.forwarded = forwarded
        this.geodata = geodata
        this.setAuthorGid(authorGid)
    }

    setAuthorGid(gid: number) {
        if (gid) {
            this.authorGid = gid
            this._id = computeId(gid + this.chatId, this.createdAt)
        }
    }
}
