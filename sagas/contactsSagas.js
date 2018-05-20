import { select, put, takeLatest } from 'redux-saga/effects'

import { BASE_URL } from '../api'
import * as actions from '../actions/contactsActions'
import UserInfo from '../server/models/UserInfo'

const fetchContacts = function * ({ payload } : {
    payload: Array<number>
}) {
    yield put({
        type: actions.FETCH_ALL_REQUEST,
        meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/users`,
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

const addContacts = function * ({ payload } : {
    payload: Array<UserInfo>
}) {
    const gids: number[] = payload.map(x => x.gid)

    yield put({
        type: actions.ADD_REQUEST,
        payload, meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/contacts`,
                    method: 'PUT',
                    credentials: 'include',
                    body: JSON.stringify(gids)
                },
                rollback: {
                    type: actions.ADD_FAILED,
                    payload: gids
                }
            }
        }
    })
}

const removeContacts = function * ({ payload } : {
    payload: Array<number>
}) {
    const contacts: Object = yield select(state => state.contacts)
    const roolback: Object = Object.values(contacts).filter(x => payload.includes(x))

    yield put({
        type: actions.REMOVE_REQUEST,
        payload, meta: {
            offline: {
                effect: {
                    url: `${BASE_URL}/contacts`,
                    method: 'DELETE',
                    credentials: 'include',
                    body: JSON.stringify(payload)
                },
                rollback: {
                    type: actions.REMOVE_FAILED,
                    payload: roolback
                }
            }
        }
    })
}

const contactsSagas = function * () {
    yield takeLatest(actions.FETCH_ALL_ACTION, fetchContacts)
    yield takeLatest(actions.ADD_ACTION, addContacts)
    yield takeLatest(actions.REMOVE_ACTION, removeContacts)
}

export default contactsSagas
