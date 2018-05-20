import * as actions from '../actions/chatsActions'

import Chat from '../server/models/Chat'
import ChatInfo from '../server/models/ChatInfo'

type StateType = {
    [key: number]: Chat
}

type ActionType = {
    type: string,
    payload: StateType | Chat | ChatInfo | number | { chatId: number, gid: number }
}

export default (state: StateType = {}, { type, payload }: ActionType): StateType => {
    const newState = {...state}

    switch (type) {
        case actions.FETCH_ALL_SUCCESS:
            return payload
        case actions.FETCH_SUCCESS:
        case actions.CREATE_REQUEST:
        case actions.REMOVE_FAILED:
        case actions.SOCKET_UPDATE_ACTION:
            newState[payload._id] = payload
            return newState
        case actions.CREATE_FAILED:
        case actions.REMOVE_REQUEST:
        case actions.SOCKET_REMOVE_ACTION:
            delete newState[payload]
            return newState
        case actions.UPDATE_REQUEST:
        case actions.UPDATE_FAILED:
            newState[payload.id].common = payload
            return newState
        case actions.ADD_MEMBER_REQUEST:
        case actions.REMOVE_MEMBER_FAILED:
            if (newState[payload.chatId]) {
                newState[payload.chatId].members.push(payload.gid)
                return newState
            }

            return state
        case actions.REMOVE_MEMBER_REQUEST:
        case actions.ADD_MEMBER_FAILED:
            newState[payload.chatId].members = newState[payload.chatId]
                .members.filter(gid => gid !== payload.gid)

            return newState
        default:
            return state
    }
}
