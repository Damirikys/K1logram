import { all, fork } from 'redux-saga/effects'

import sessionSagas from './sessionSagas'
import contactsSagas from './contactsSagas'
import chatsSagas from './chatsSagas'
import messagesSagas from './messagesSagas'

export const rootSaga = function * () {
    yield all([
        fork(sessionSagas),
        fork(contactsSagas),
        fork(chatsSagas),
        fork(messagesSagas)
    ])
}
