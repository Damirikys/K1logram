// @flow

import * as actions from '../actions/userActions'

import UserProfile from '../server/models/UserProfile'
import UserInfo from '../server/models/UserInfo'

type ActionType = {
    type: string,
    payload: UserProfile & UserInfo
}

export default (state: UserProfile = null, { type, payload }: ActionType): UserProfile => {
    switch (type) {
        case actions.INITIAL_SESSION_ACTION:
        case actions.FETCH_PROFILE_SUCCESS:
            return payload
        case actions.UPDATE_USER_SUCCESS:
        case actions.UPDATE_USER_FAILED:
            return new UserProfile({ ...state, user: payload })
        default:
            return state
    }
}
