import * as actions from '../actions/contactsActions'

import UserInfo from '../server/models/UserInfo'

type StateType = {
    [key: number]: UserInfo
}

type ActionType = {
    type: string,
    payload: StateType | UserInfo | Array<number>
}

export default (state: StateType = {}, { type, payload }: ActionType): StateType => {
    const newState = {...state}

    switch (type) {
        case actions.FETCH_ALL_SUCCESS:
        case actions.ADD_SUCCESS:
            return Object.assign(newState, payload)
        case actions.ADD_FAILED:
        case actions.REMOVE_FAILED:
            return payload
        case actions.REMOVE_SUCCESS:
            payload.forEach(gid => delete newState[gid])
            return newState
        case actions.SOCKET_UPDATE_ACTION:
            newState[payload.gid] = payload
            return newState
        default:
            return state
    }
}
