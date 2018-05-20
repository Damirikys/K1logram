import { put, takeLatest, all, select } from 'redux-saga/effects'
import { BASE_URL } from '../api'

import * as userActions from '../actions/userActions'
import * as contactsActions from '../actions/contactsActions'
import * as chatsActions from '../actions/chatsActions'

import { socketClient } from '../components/Body'

import { types } from '../server/models/SocketEvent'
import { dispatch } from '../store'

import UserProfile from '../server/models/UserProfile'
import UserInfo from '../server/models/UserInfo'
import Chat from '../server/models/Chat'
import Event from '../server/models/Event'

const prepareInvite = function * ({ payload, invite: chatId } : {
    payload: UserProfile,
    chatId: number
}) {
    if (chatId && !payload.chats.includes(chatId)) {
        yield put({
            type: chatsActions.ADD_MEMBER_ACTION,
            payload: { chatId, gid: payload.user.gid }
        })
    }
}

const fetchSelf = function * ({ payload }) {
    yield put({
        type: userActions.FETCH_PROFILE_REQUEST,
        meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/user`,
                    method: 'GET',
                    credentials: 'include'
                },
                commit: {
                    type: userActions.FETCH_PROFILE_SUCCESS,
                    invite: payload
                }
            }
        }
    })
}

const socketInit = function * ({ fromSocket, payload: profile }) {
    if (fromSocket) {
        return
    }

    const socket = socketClient()

    socket.emit('connect_auth', profile)

    socket.on(types.USER_UPDATE, (profile: UserProfile) => {
        socket.emit('connect_auth', profile)

        dispatch({ type: userActions.FETCH_PROFILE_SUCCESS, payload: profile, fromSocket: true })
        dispatch({ type: contactsActions.FETCH_ALL_ACTION, payload: profile.contacts })
        dispatch({ type: chatsActions.FETCH_ALL_ACTION, payload: profile.chats })
    })

    socket.on(types.CONTACT_UPDATE, (payload: UserInfo) => {
        dispatch({ type: contactsActions.SOCKET_UPDATE_ACTION, payload })
    })

    socket.on(types.CHAT_UPDATE, (payload: Chat) => {
        dispatch({ type: chatsActions.SOCKET_UPDATE_ACTION, payload })
        dispatch({ type: chatsActions.FETCH_MEMBERS_ACTION, payload: payload.members })
    })

    socket.on(types.CHAT_REMOVE, (payload: number) => {
        dispatch({ type: chatsActions.SOCKET_REMOVE_ACTION, payload })
    })

    socket.on(types.CHAT_EVENT, (payload: Event) => {
        dispatch({ type: chatsActions.SOCKET_EVENT_ACTION, payload })
    })

    yield all([
        put({ type: contactsActions.FETCH_ALL_ACTION, payload: profile.contacts }),
        put({ type: chatsActions.FETCH_ALL_ACTION, payload: profile.chats })
    ])
}

const updateSelf = function * ({ payload } : {
    payload: UserInfo
}) {
    const user: UserInfo = yield select(state => state.session.user)
    payload.gid = user.gid

    yield put({
        type: userActions.UPDATE_USER_REQUEST,
        payload, meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/user`,
                    method: 'PATCH',
                    credentials: 'include',
                    body: JSON.stringify(user)
                },
                rollback: {
                    type: userActions.UPDATE_USER_FAILED,
                    payload: user
                }
            }
        }
    })
}

const sessionSagas = function * () {
    yield takeLatest(userActions.FETCH_PROFILE_ACTION, fetchSelf)
    yield takeLatest(userActions.FETCH_PROFILE_SUCCESS, socketInit)
    yield takeLatest(userActions.FETCH_PROFILE_SUCCESS, prepareInvite)
    yield takeLatest(userActions.UPDATE_USER_ACTION, updateSelf)
}

export default sessionSagas
