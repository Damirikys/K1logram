// @flow

interface ChatInfoType {
    id?: number,
    name: string
}

export default class ChatInfo implements ChatInfoType {
    id: number
    name: string

    constructor({ id = Date.now(), name }: ChatInfoType) {
        this.id = id
        this.name = name
    }
}
