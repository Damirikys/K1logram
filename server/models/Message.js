// @flow

interface MessageType {
    text: string,
    chatId: number,
    authorGid: number,
    createdAt: number,
    clusterId: number
}

export default class Message implements MessageType {
    text: string
    chatId: number
    authorGid: number
    createdAt: number
    clusterId: number

    constructor({ text, chatId, authorGid, createdAt = Date.now(), clusterId = -1 }: MessageType) {
        this.text = text
        this.chatId = chatId
        this.authorGid = authorGid
        this.createdAt = createdAt
        this.clusterId = clusterId
    }
}
