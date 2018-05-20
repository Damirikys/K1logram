// @flow

import { applyMiddleware, createStore, Store, Middleware } from 'redux'
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import { offline } from '@redux-offline/redux-offline'
import defaultConfig from '@redux-offline/redux-offline/lib/defaults'

import rootReducer from '../reducers'
import { rootSaga } from '../sagas'

let reduxStore: Store

export default (): Store => {
    if (reduxStore) {
        return reduxStore
    }

    const sagaMiddleware: SagaMiddleware = createSagaMiddleware()
    const middleware: Middleware = composeWithDevTools(applyMiddleware(sagaMiddleware))

    reduxStore = offline({ ...defaultConfig,
        persistOptions: {
            blacklist: ['ui', 'forwarded']
        }
    })(createStore)(rootReducer, middleware)

    sagaMiddleware.run(rootSaga)

    return reduxStore
}

export const dispatch = (action: Object) => reduxStore.dispatch(action)
