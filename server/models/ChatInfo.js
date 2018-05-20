// @flow

interface ChatInfoType {
    name: string,
    createdAt: number
}

export default class ChatInfo implements ChatInfoType {
    name: string
    createdAt: number

    constructor({ createdAt = Date.now(), name }: ChatInfoType) {
        this.name = name
        this.createdAt = createdAt
    }
}
