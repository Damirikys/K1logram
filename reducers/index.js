// @flow

import { combineReducers } from 'redux'

import sessionReducer from './sessionReducer'
import contactsReducer from './contactsReducer'
import chatsReducer from './chatsReducer'
import messagesReducer from './messagesReducer'
import chatsMembersReducer from './chatsMembersReducer'
import uiReducer from './uiReducer'
import forwardedReducer from './forwardedReducer'
import themeReducer from './themeReducer'

export default combineReducers({
    session: sessionReducer,
    contacts: contactsReducer,
    chats: chatsReducer,
    chatsMembers: chatsMembersReducer,
    messages: messagesReducer,
    ui: uiReducer,
    forwarded: forwardedReducer,
    theme: themeReducer
})
