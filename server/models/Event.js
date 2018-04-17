// @flow

interface EventType {
    type: string
}

export const types = {
    NEW_MESSAGE: 'NEW_MESSAGE_EVENT',
    EDIT_MESSAGE: 'EDIT_MESSAGE_EVENT',
    DELETE_MESSAGE: 'DELETE_MESSAGE_EVENT'
}

export default class Event implements EventType {
    type: string
    payload: any

    constructor(type: string, payload: any) {
        this.type = type
        this.payload = payload
    }
}

export const filters = {
    isMessage: (event: Event) => event.type === types.NEW_MESSAGE,
    isEditing: (event: Event) => event.type === types.EDIT_MESSAGE,
    isDeleting: (event: Event) => event.type === types.DELETE_MESSAGE
}
