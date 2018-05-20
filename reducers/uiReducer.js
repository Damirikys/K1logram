// @flow

import Router from 'next/router'

import * as ui from '../actions/uiActions'

import UserInfo from '../server/models/UserInfo'

type StateType = {
    selectedChatId: number,
    [ui.entities.CHAT_CREATE_MODAL]: boolean,
    [ui.entities.CONTACT_ADD_MODAL]: boolean,
    [ui.entities.PROFILE_MODAL]: { user: UserInfo, visible: boolean }
}

type ActionType = {
    type: string,
    payload: any
}

const initialState: StateType = {
    restored: false,
    selectedChatId: null,
    [ui.entities.CHAT_CREATE_MODAL]: false,
    [ui.entities.CONTACT_ADD_MODAL]: false,
    [ui.entities.PROFILE_MODAL]: { user: null, visible: false }
}

export default (state: StateType = initialState, { type, payload }: ActionType): StateType => {
    switch (type) {
        case ui.REHYDRATE_ACTION:
            return { ...state, restored: true }
        case ui.SELECT_CHAT_ACTION:
            if (payload === state.selectedChatId) {
                return state
            }

            const href = payload ? `/?im=${payload}` : `/`
            Router.replace(href, href, { shallow: true })

            return { ...state, selectedChatId: payload }
        case ui.CLOSE_PROFILE_MODAL:
            return { ...state, [ui.entities.PROFILE_MODAL]: {
                ...state[ui.entities.PROFILE_MODAL],
                visible: false
            }}
        case ui.SHOW_PROFILE_MODAL:
            return { ...state, [ui.entities.PROFILE_MODAL]: {
                user: payload,
                visible: true
            }}
        case ui.SHOW_CHAT_CREATE_MODAL:
            return { ...state, [ui.entities.CHAT_CREATE_MODAL]: true }
        case ui.CLOSE_CHAT_CREATE_MODAL:
            return { ...state, [ui.entities.CHAT_CREATE_MODAL]: false }
        case ui.SHOW_CONTACT_ADD_MODAL:
            return { ...state, [ui.entities.CONTACT_ADD_MODAL]: true }
        case ui.CLOSE_CONTACT_ADD_MODAL:
            return { ...state, [ui.entities.CONTACT_ADD_MODAL]: false }
        default:
            return state
    }
}
