import { select, put, takeLatest } from 'redux-saga/effects'

import { BASE_URL } from '../api'

import * as chatsActions from '../actions/chatsActions'
import * as actions from '../actions/messagesActions'
import { statuses as status } from '../reducers/messagesReducer'

import ServiceWorkerManager from '../serviceWorker'

import UserInfo from '../server/models/UserInfo'
import Message from '../server/models/Message'
import Event, { types } from '../server/models/Event'
import computeId from '../server/utils/cantor-pairing'
import UserProfile from '../server/models/UserProfile'

import avatarByGid from '../utils/avatarByGid'

const mapSocketEventToAction = (type): string => {
    switch (type) {
        case types.NEW_MESSAGE:
            return actions.SOCKET_NEW_MESSAGE
        case types.EDIT_MESSAGE:
            return actions.SOCKET_EDIT_MESSAGE
        case types.DELETE_MESSAGE:
            return actions.SOCKET_DELETE_MESSAGE
        default: break
    }
}

const fetchAllMessages = function * ({ payload } : {
    payload: Object
}) {
    const session: UserProfile = yield select(state => state.session)
    const body: number[] = session.contacts
        .map(gid => computeId(gid, session.user.gid))
        .concat(Object.keys(payload))

    yield put({
        type: actions.FETCH_ALL_REQUEST,
        meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/messages`,
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(body)
                },
                commit: {
                    type: actions.FETCH_ALL_SUCCESS
                }
            }
        }
    })
}

const sendMessage = function * ({ payload: message } : {
    message: Message
}) {
    const user: UserInfo = yield select(state => state.session.user)
    message.setAuthorGid(user.gid)

    yield put({
        type: actions.SEND_REQUEST,
        payload: { ...message, status: status.PENDING },
        meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/messages/${message.chatId}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: JSON.stringify(message)
                },
                commit: {
                    type: actions.SEND_SUCCESS,
                    payload: { ...message, status: status.OK }
                },
                rollback: {
                    type: actions.SEND_FAILED,
                    payload: { ...message, status: status.FAILED }
                }
            }
        }
    })
}

const editMessage = function * ({ payload: message } : {
    message: Message
}) {
    yield put({
        type: actions.EDIT_REQUEST,
        payload: { ...message, status: status.PENDING },
        meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/messages`,
                    method: 'PATCH',
                    credentials: 'include',
                    body: JSON.stringify(message)
                },
                commit: {
                    type: actions.EDIT_SUCCESS,
                    payload: { ...message, status: status.OK }
                },
                rollback: {
                    type: actions.EDIT_FAILED,
                    payload: { ...message, status: status.FAILED }
                }
            }
        }
    })
}

const socketEvent = function * ({ payload: event } : {
    event: Event
}) {
    yield put({ type: mapSocketEventToAction(event.type), payload: event.payload })
}

const socketNewMessage = function * ({ payload: message } : {
    message: Message
}) {
    const { user } = yield select(state => state.session)
    const { selectedChatId } = yield select(state => state.ui)
    const chatsMembers = yield select(state => state.chatsMembers)

    if (message.authorGid !== user.gid && (selectedChatId !== message.chatId || !document.hasFocus())) {
        const author = chatsMembers[message.authorGid]
        ServiceWorkerManager.sendNotification('Новое сообщение', {
            body: `${author.name}: ${message.text}`,
            icon: avatarByGid(message.authorGid),
            tag: String(message.chatId),
            renotify: true,
            vibrate: [500, 250, 500]
        })
    }
}

const messagesSagas = function * () {
    yield takeLatest(chatsActions.FETCH_ALL_SUCCESS, fetchAllMessages)
    yield takeLatest(actions.SEND_ACTION, sendMessage)
    yield takeLatest(actions.EDIT_ACTION, editMessage)
    yield takeLatest(chatsActions.SOCKET_EVENT_ACTION, socketEvent)
    yield takeLatest(actions.SOCKET_NEW_MESSAGE, socketNewMessage)
}

export default messagesSagas
