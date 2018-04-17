// @flow

export default class SocketEvent {
    type: string
    data: any

    constructor(type: string, data: any) {
        this.type = type
        this.data = data
    }
}

export const types = {
    USER_UPDATE: 'USER_UPDATE_EVENT',
    CONTACT_UPDATE: 'CONTACT_UPDATE_EVENT',
    CHAT_UPDATE: 'CHAT_UPDATE_EVENT',
    CHAT_REMOVE: 'CHAT_REMOVE_EVENT',
    CHAT_EVENT: 'CHAT_EVENT_EVENT'
}
