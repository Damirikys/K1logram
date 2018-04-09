import express from 'express'

import * as profile from '../controllers/profile'
import * as chats from '../controllers/chats'
import * as messages from '../controllers/messages'

const router = express.Router()

/* Profile API */
router.get('/user', profile.fetchSelf)
router.post('/users', profile.fetchAllUsers)
router.get('/user/:gid', profile.fetchUser)
router.patch('/user', profile.updateUser)

/* Contacts API */
router.put('/contacts', profile.addContacts)
router.delete('/contacts', profile.removeContacts)

/* Chats API */
router.get('/chats/:id', chats.fetchChat)
router.post('/chats', chats.fetchAllChats)
router.put('/chats', chats.createChat)
router.patch('/chat', chats.updateChatInfo)
router.delete('/chat/:id', chats.deleteChat)
router.put('/chat/:id/members', chats.addMemberToChat)
router.delete('/chat/:id/members', chats.deleteMemberFromChat)

/* Messages API */
router.get('/messages/:chatId', messages.getMessages)
router.put('/messages/:chatId', messages.addMessage)
router.patch('/messages', messages.editMessage)
router.delete('/messages', messages.deleteMessage)

export default router
