// @flow

import UserInfo from './UserInfo'

export interface UserProfileType {
    user: UserInfo,
    contacts?: Array<number>,
    chats?: Array<number>
}

export default class UserProfile implements UserProfileType {
    user: UserInfo
    contacts: Array<number>
    chats: Array<number>

    constructor({ user, contacts = [], chats = [] }: UserProfileType) {
        this.user = user
        this.contacts = contacts
        this.chats = chats
    }
}
