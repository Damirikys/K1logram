import {put, call, takeLatest, all, select} from 'redux-saga/effects'
import { OK } from 'http-status-codes'

import API from '../api'

import * as userActions from '../actions/userActions'
import * as contactsActions from '../actions/contactsActions'
import * as chatsActions from '../actions/chatsActions'

import { types } from '../server/models/SocketEvent'
import { dispatch } from '../store'

import UserProfile from '../server/models/UserProfile'
import UserInfo from '../server/models/UserInfo'
import Chat from '../server/models/Chat'
import Event from '../server/models/Event'

const fetchSelf = function * ({ payload: socket }) {
    const profile: UserProfile = yield call(API.fetchSelf)

    socket.emit('connect_auth', profile)

    socket.on(types.USER_UPDATE, (profile: UserProfile) => {
        socket.emit('connect_auth', profile)

        dispatch({ type: userActions.FETCH_PROFILE_SUCCESS, payload: profile })
        dispatch({ type: contactsActions.FETCH_ALL_ACTION, payload: profile.contacts })
        dispatch({ type: chatsActions.FETCH_ALL_ACTION, payload: profile.chats })
    })

    socket.on(types.CONTACT_UPDATE, (payload: UserInfo) => {
        dispatch({ type: contactsActions.SOCKET_UPDATE_ACTION, payload })
    })

    socket.on(types.CHAT_UPDATE, (payload: Chat) => {
        dispatch({ type: chatsActions.SOCKET_UPDATE_ACTION, payload })
    })

    socket.on(types.CHAT_REMOVE, (payload: number) => {
        dispatch({ type: chatsActions.SOCKET_REMOVE_ACTION, payload })
    })

    socket.on(types.CHAT_EVENT, (payload: Event) => {
        dispatch({ type: chatsActions.SOCKET_EVENT_ACTION, payload })
    })

    yield all([
        put({ type: userActions.FETCH_PROFILE_SUCCESS, payload: profile }),
        put({ type: contactsActions.FETCH_ALL_ACTION, payload: profile.contacts }),
        put({ type: chatsActions.FETCH_ALL_ACTION, payload: profile.chats })
    ])
}

const updateSelf = function * ({ payload } : {
    payload: UserInfo
}) {
    const user: UserInfo = yield select(state => state.session.user)
    payload.gid = user.gid

    yield put({ type: userActions.UPDATE_USER_SUCCESS, payload })

    const response = yield call(API.updateSelf, payload)

    if (response.status !== OK) {
        yield put({ type: userActions.UPDATE_USER_FAILED, payload: user })
    }
}

const sessionSagas = function * () {
    yield takeLatest(userActions.FETCH_PROFILE_ACTION, fetchSelf)
    yield takeLatest(userActions.UPDATE_USER_ACTION, updateSelf)
}

export default sessionSagas
