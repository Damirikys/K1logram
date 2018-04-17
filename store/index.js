// @flow

import { applyMiddleware, createStore, Store, Middleware } from 'redux'
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from '../reducers'
import { rootSaga } from '../sagas'

let reduxStore: Store

export default (): Store => {
    if (reduxStore) {
        return reduxStore
    }

    const sagaMiddleware: SagaMiddleware = createSagaMiddleware()
    const middleware: Middleware = composeWithDevTools(applyMiddleware(sagaMiddleware))

    reduxStore = createStore(rootReducer, middleware)

    sagaMiddleware.run(rootSaga)

    return reduxStore
}

export const dispatch = (action: Object) => reduxStore.dispatch(action)
