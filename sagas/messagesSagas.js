import { select, put, call, takeLatest } from 'redux-saga/effects'
import { OK } from 'http-status-codes'

import API from '../api'

import * as chatsActions from '../actions/chatsActions'
import * as actions from '../actions/messagesActions'

import UserInfo from '../server/models/UserInfo'
import Message from '../server/models/Message'
import Event, { types } from '../server/models/Event'

const fetchAllMessages = function * ({ payload } : {
    payload: Object
}) {
    const response: Object = yield call(API.fetchAllMessages, Object.keys(payload))
    yield put({ type: actions.FETCH_ALL_SUCCESS, payload: response })
}

const socketEvent = function * ({ payload: event } : {
    event: Event,
    payload: Event
}) {
    switch (event.type) {
        case types.NEW_MESSAGE:
            yield put({ type: actions.SOCKET_NEW_MESSAGE, payload: event.payload })
            break
        case types.EDIT_MESSAGE:
            yield put({ type: actions.SOCKET_EDIT_MESSAGE, payload: event.payload })
            break
        case types.DELETE_MESSAGE:
            yield put({ type: actions.SOCKET_DELETE_MESSAGE, payload: event.payload })
            break
        default: break
    }
}

const sendMessage = function * ({ payload } : {
    payload: Message
}) {
    const user: UserInfo = yield select(state => state.session.user)
    const messages: Object = yield select(state => state.messages)
    payload.authorGid = user.gid

    yield put({ type: actions.SEND_SUCCESS, payload })

    const response = yield call(API.addMessage, payload)

    if (response.status !== OK) {
        yield put({ type: actions.SEND_FAILED, payload: messages })
    }
}

const messagesSagas = function * () {
    yield takeLatest(chatsActions.FETCH_ALL_SUCCESS, fetchAllMessages)
    yield takeLatest(chatsActions.SOCKET_EVENT_ACTION, socketEvent)
    yield takeLatest(actions.SEND_ACTION, sendMessage)
}

export default messagesSagas
