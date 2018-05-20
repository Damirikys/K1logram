import { put, takeLatest, select } from 'redux-saga/effects'

import { BASE_URL } from '../api'

import * as actions from '../actions/chatsActions'

import Chat from '../server/models/Chat'
import UserInfo from '../server/models/UserInfo'
import ChatInfo from '../server/models/ChatInfo'

const fetchChats = function * ({ payload } : {
    payload: Array<number>
}) {
    yield put({
        type: actions.FETCH_ALL_REQUEST,
        meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/chats`,
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(payload)
                },
                commit: {
                    type: actions.FETCH_ALL_SUCCESS
                }
            }
        }
    })
}

const fetchMembersFromChats = function * ({ payload: chats }) {
    const membersMap = Object.values(chats).reduce((res, cur: Chat) => {
        cur.members.forEach(gid => res[gid] = true)
        return res
    }, {})

    yield put({ type: actions.FETCH_MEMBERS_ACTION, payload: Object.keys(membersMap) })
}

const fetchMembers = function * ({ payload }) {
    yield put({
        type: actions.FETCH_MEMBERS_REQUEST,
        meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/users`,
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(payload)
                },
                commit: {
                    type: actions.FETCH_MEMBERS_SUCCESS
                }
            }
        }
    })
}

const fetchChat = function * ({ payload } : {
    payload: number
}) {
    yield put({
        type: actions.FETCH_REQUEST,
        meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/chats/${payload}`,
                    method: 'GET',
                    credentials: 'include'
                },
                commit: {
                    type: actions.FETCH_SUCCESS
                }
            }
        }
    })
}

const createChat = function * ({ payload: chat } : {
    chat: Chat
}) {
    const user: UserInfo = yield select(state => state.session.user)
    chat.setOwner(user.gid)

    yield put({
        type: actions.CREATE_REQUEST,
        payload: chat,
        meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/chats`,
                    method: 'PUT',
                    credentials: 'include',
                    body: JSON.stringify(chat)
                },
                rollback: {
                    type: actions.CREATE_FAILED,
                    payload: chat._id
                }
            }
        }
    })
}

const removeChat = function * ({ payload: chat } : {
    chat: Chat
}) {
    yield put({
        type: actions.REMOVE_REQUEST,
        payload: chat._id,
        meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/chat/${chat._id}`,
                    method: 'DELETE',
                    credentials: 'include'
                },
                rollback: {
                    type: actions.REMOVE_FAILED,
                    payload: chat
                }
            }
        }
    })
}

const updateChatInfo = function * ({ payload: chatInfo } : {
    chatInfo: ChatInfo
}) {
    const chats: Object = yield select(state => state.chats)
    const chatInfoRollback: ChatInfo = chats[chatInfo.id].common

    yield put({
        type: actions.UPDATE_REQUEST,
        payload: chatInfo,
        meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/chat`,
                    method: 'PATCH',
                    credentials: 'include',
                    body: JSON.stringify(chatInfo)
                },
                rollback: {
                    type: actions.UPDATE_FAILED,
                    payload: chatInfoRollback
                }
            }
        }
    })
}

const addMemberToChat = function * ({ payload: { chatId, gid } } : {
    payload: {
        chatId: number,
        gid: number
    }
}) {
    yield put({
        type: actions.ADD_MEMBER_REQUEST,
        payload: { chatId, gid },
        meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/chat/${chatId}/members`,
                    method: 'PUT',
                    credentials: 'include',
                    body: JSON.stringify({ gid })
                },
                rollback: {
                    type: actions.ADD_MEMBER_FAILED,
                    payload: { chatId, gid }
                }
            }
        }
    })
}

const removeMemberFromChat = function * ({ payload: { chatId, gid } } : {
    payload: {
        chatId: number,
        gid: number
    }
}) {
    yield put({
        type: actions.REMOVE_MEMBER_REQUEST,
        payload: { chatId, gid },
        meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/chat/${chatId}/members`,
                    method: 'DELETE',
                    credentials: 'include',
                    body: JSON.stringify({ gid })
                },
                rollback: {
                    type: actions.REMOVE_MEMBER_FAILED,
                    payload: { chatId, gid }
                }
            }
        }
    })
}

const chatsSagas = function * () {
    yield takeLatest(actions.FETCH_ALL_ACTION, fetchChats)
    yield takeLatest(actions.FETCH_ALL_SUCCESS, fetchMembersFromChats)
    yield takeLatest(actions.FETCH_MEMBERS_ACTION, fetchMembers)
    yield takeLatest(actions.FETCH_ACTION, fetchChat)
    yield takeLatest(actions.CREATE_ACTION, createChat)
    yield takeLatest(actions.REMOVE_ACTION, removeChat)
    yield takeLatest(actions.UPDATE_ACTION, updateChatInfo)
    yield takeLatest(actions.ADD_MEMBER_ACTION, addMemberToChat)
    yield takeLatest(actions.REMOVE_MEMBER_ACTION, removeMemberFromChat)
}

export default chatsSagas
