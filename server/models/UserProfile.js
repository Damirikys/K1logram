// @flow

import UserInfo from './UserInfo'

export interface UserProfileType {
    _id: number,
    user: UserInfo,
    contacts?: Array<number>,
    chats?: Array<number>
}

export default class UserProfile implements UserProfileType {
    _id: number
    user: UserInfo
    contacts: Array<number>
    chats: Array<number>

    constructor({ user, contacts = [], chats = [] }: UserProfileType) {
        this._id = user.gid
        this.user = user
        this.contacts = contacts
        this.chats = chats
    }
}
