import { select, put, call, takeLatest } from 'redux-saga/effects'
import { OK } from 'http-status-codes'

import API from '../api'

import * as actions from '../actions/contactsActions'

import UserInfo from '../server/models/UserInfo'

const fetchContacts = function * ({ payload } : {
    payload: Array<number>
}) {
    const contacts: Object = yield call(API.fetchContacts, payload)
    yield put({ type: actions.FETCH_ALL_SUCCESS, payload: contacts })
}

const addContacts = function * ({ payload } : {
    payload: Array<UserInfo>
}) {
    const contacts: Object = yield select(state => state.contacts)
    yield put({
        type: actions.ADD_SUCCESS,
        payload: payload.reduce((res, cur) => ({ ...res, [cur.gid]: cur }), {})
    })

    const response = yield call(API.addContacts, payload.map(x => x.gid))

    if (response.status !== OK) {
        yield put({ type: actions.ADD_FAILED, payload: contacts })
    }
}

const removeContacts = function * ({ payload } : {
    payload: Array<number>
}) {
    const contacts: Object = yield select(state => state.contacts)
    yield put({ type: actions.REMOVE_SUCCESS, payload })

    const response = yield call(API.removeContacts, payload)

    if (response.status !== OK) {
        yield put({ type: actions.REMOVE_FAILED, payload: contacts })
    }
}

const contactsSagas = function * () {
    yield takeLatest(actions.FETCH_ALL_ACTION, fetchContacts)
    yield takeLatest(actions.ADD_ACTION, addContacts)
    yield takeLatest(actions.REMOVE_ACTION, removeContacts)
}

export default contactsSagas
