// @flow

import { OK, NOT_MODIFIED, NOT_FOUND } from 'http-status-codes'

import UserAPI from '../api/user'
import UserInfo from '../models/UserInfo'
import UserProfile from '../models/UserProfile'

export const fetchSelf = async ({ user }: {
    user: UserProfile
}, res: Object) => {
    try {
        const response: UserProfile = await UserAPI.fetch(user.user.gid)
        user.user = response.user
        user.contacts = response.contacts
        user.chats = response.chats

        return res.status(OK).json(user)
    } catch (e) {
        return res.sendStatus(NOT_FOUND)
    }
}

export const fetchUser = async ({ params: { gid } }: {
    params: { gid: string }
}, res: Object) => {
    try {
        const profile: UserProfile = await UserAPI.fetch(Number(gid))
        const user: UserInfo = profile.user

        return res.status(OK).json(user)
    } catch (e) {
        return res.sendStatus(NOT_FOUND)
    }
}

export const fetchAllUsers = async ({ body: gids }: {
    gids: Array<number>,
    body: Array<number>
}, res: Object) => {
    try {
        const fetchedProfiles: Array<UserProfile> = await Promise.all(gids.map(UserAPI.fetch))
        const response: Object = fetchedProfiles.reduce((res, cur) => ({ ...res, [cur.user.gid]: cur.user }), {})

        return res.status(OK).json(response)
    } catch (e) {
        return res.sendStatus(NOT_FOUND)
    }
}

export const updateUser = async ({ user, body }: {
    user: UserProfile,
    body: UserInfo
}, res: Object) => {
    try {
        await UserAPI.update(new UserProfile({ ...user, user: body }), true)

        user.user = body

        return res.sendStatus(OK)
    } catch (e) {
        return res.sendStatus(NOT_MODIFIED)
    }
}

export const addContacts = async ({ user, body: contacts }: {
    user: UserProfile,
    contacts: Array<number>,
    body: Array<number>
}, res: Object) => {
    try {
        const updatedContacts: Array<number> = [...user.contacts, ...contacts]
        const myProfile: UserProfile = new UserProfile({ ...user, contacts: updatedContacts })

        const addContactToUserProfiles = async (gid: number): Promise<void> => {
            const profile: UserProfile = await UserAPI.fetch(gid)
            profile.contacts = [...profile.contacts, user.user.gid]

            return UserAPI.update(profile)
        }

        await Promise.all([
            UserAPI.update(myProfile),
            ...updatedContacts.map(addContactToUserProfiles)
        ])

        user.contacts = updatedContacts

        return res.sendStatus(OK)
    } catch (e) {
        return res.sendStatus(NOT_MODIFIED)
    }
}

export const removeContacts = async ({ user, body: contacts }: {
    user: UserProfile,
    contacts: Array<number>,
    body: Array<number>
}, res: Object) => {
    try {
        const updatedContacts: Array<number> = user.contacts.filter(x => !contacts.includes(x))
        const myProfile: UserProfile = new UserProfile({ ...user, contacts: updatedContacts })

        const removeContactFromUserProfiles = async (gid: number): Promise<void> => {
            const profile: UserProfile = await UserAPI.fetch(gid)
            profile.contacts = profile.contacts.filter(gid => gid !== myProfile.user.gid)

            return UserAPI.update(profile)
        }

        await Promise.all([
            UserAPI.update(myProfile),
            ...contacts.map(removeContactFromUserProfiles)
        ])

        user.contacts = updatedContacts

        return res.sendStatus(OK)
    } catch (e) {
        return res.sendStatus(NOT_MODIFIED)
    }
}

export const getAvatar = async ({ params: { gid } }: {
    params: { gid: string }
}, res: Object) => {
    try {
        return res.status(OK).send(await UserAPI.getAvatar(gid))
    } catch (e) {
        return res.sendStatus(NOT_FOUND)
    }
}
