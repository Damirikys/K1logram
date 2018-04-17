import {put, call, takeLatest, select} from 'redux-saga/effects'
import { OK } from 'http-status-codes'

import API from '../api'

import * as actions from '../actions/chatsActions'

import Chat from '../server/models/Chat'
import UserInfo from '../server/models/UserInfo'
import ChatInfo from '../server/models/ChatInfo'

const fetchChats = function * ({ payload } : {
    payload: Array<number>
}) {
    const chats: Object = yield call(API.fetchChats, payload)
    yield put({ type: actions.FETCH_ALL_SUCCESS, payload: chats })

    const membersMap = Object.values(chats).reduce((res, cur: Chat) => {
        cur.members.forEach(gid => res[gid] = true)
        return res
    }, {})

    const members: Object = yield call(API.fetchContacts, Object.keys(membersMap))
    yield put({ type: actions.FETCH_MEMBERS_SUCCESS, payload: members })
}

const fetchChat = function * ({ payload } : {
    payload: number
}) {
    const chat: Chat = yield call(API.fetchChat, payload)
    yield put({ type: actions.FETCH_SUCCESS, payload: chat })
}

const createChat = function * ({ payload: chat } : {
    chat: Chat,
    payload: Chat
}) {
    const chats: Object = yield select(state => state.chats)
    const user: UserInfo = yield select(state => state.session.user)
    chat.setOwner(user.gid)

    yield put({ type: actions.CREATE_SUCCESS, payload: chat })

    const response = yield call(API.createChat, chat)

    if (response.status !== OK) {
        yield put({ type: actions.CREATE_FAILED, payload: chats })
    }
}

const removeChat = function * ({ payload: chat } : {
    chat: Chat,
    payload: Chat
}) {
    const chats: Object = yield select(state => state.chats)
    yield put({ type: actions.REMOVE_SUCCESS, payload: chat })

    const response = yield call(API.removeChat, chat.common.id)

    if (response.status !== OK) {
        yield put({ type: actions.REMOVE_FAILED, payload: chats })
    }
}

const updateChatInfo = function * ({ payload: chatInfo } : {
    chatInfo: ChatInfo,
    payload: ChatInfo
}) {
    const chats: Object = yield select(state => state.chats)
    yield put({ type: actions.UPDATE_SUCCESS, payload: chatInfo })

    const response = yield call(API.updateChatInfo, chatInfo)

    if (response.status !== OK) {
        yield put({ type: actions.UPDATE_FAILED, payload: chats })
    }
}

const addMemberToChat = function * ({ payload: { chatId, gid } } : {
    payload: {
        chatId: number,
        gid: number
    }
}) {
    const chats: Object = yield select(state => state.chats)
    yield put({ type: actions.ADD_MEMBER_SUCCESS, payload: { chatId, gid } })

    const response = yield call(API.addMemberToChat, chatId, gid)

    if (response.status !== OK) {
        yield put({ type: actions.ADD_MEMBER_FAILED, payload: chats })
    }
}

const removeMemberFromChat = function * ({ payload: { chatId, gid } } : {
    payload: {
        chatId: number,
        gid: number
    }
}) {
    const chats: Object = yield select(state => state.chats)
    yield put({ type: actions.REMOVE_MEMBER_SUCCESS, payload: { chatId, gid } })

    const response = yield call(API.removeMemberFromChat, chatId, gid)

    if (response.status !== OK) {
        yield put({ type: actions.REMOVE_MEMBER_FAILED, payload: chats })
    }
}

const chatsSagas = function * () {
    yield takeLatest(actions.FETCH_ALL_ACTION, fetchChats)
    yield takeLatest(actions.FETCH_ACTION, fetchChat)
    yield takeLatest(actions.CREATE_ACTION, createChat)
    yield takeLatest(actions.REMOVE_ACTION, removeChat)
    yield takeLatest(actions.UPDATE_ACTION, updateChatInfo)
    yield takeLatest(actions.ADD_MEMBER_ACTION, addMemberToChat)
    yield takeLatest(actions.REMOVE_MEMBER_ACTION, removeMemberFromChat)
}

export default chatsSagas
