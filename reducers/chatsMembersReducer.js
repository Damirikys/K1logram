import * as actions from '../actions/chatsActions'

import UserInfo from '../server/models/UserInfo'

type StateType = {
    [key: number]: UserInfo
}

type ActionType = {
    type: string,
    payload: StateType
}

export default (state: StateType = {}, { type, payload }: ActionType): StateType => {
    switch (type) {
        case actions.FETCH_MEMBERS_SUCCESS:
            return {...state, ...payload}
        default:
            return state
    }
}
