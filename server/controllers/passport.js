// @flow

import UserAPI from '../api/user'
import UserProfile from '../models/UserProfile'
import UserInfo from '../models/UserInfo'

export const serializeUser = async ({ _json }: Object, serialize: Function) => {
    try {
        serialize(null, await UserAPI.fetch(_json.id))
    } catch (e) {
        console.log('ERROR USER NOT FOUND!!!!!')
        console.log(e)
        const user: UserProfile = new UserProfile({
            user: new UserInfo({
                gid: _json.id,
                name: _json.name,
                bio: _json.bio,
                email: _json.email,
                avatar: _json.avatar_url
            })
        })

        await UserAPI.update(user)

        serialize(null, user)
    }
}

export const deserializeUser = (user: Object, deserialize: Function) => {
    deserialize(null, user)
}
