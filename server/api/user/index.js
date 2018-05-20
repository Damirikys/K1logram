// @flow

import Identicon from 'identicon.js'

import UserProfile from '../../models/UserProfile'
import SocketEvent, { types } from '../../models/SocketEvent'
import { userModel, avatarsModel, pushTokensModel } from '../mongodb'

import socketManager from '../../socket'

export default class UserAPI {
    static fetch(gid: number): Promise<UserProfile> {
        return userModel.get(gid)
    }

    static fetchBy(key: string, query: string, options?: Object = { limit: 10, offset: 0 }): Promise<Array<UserProfile>> {
        return userModel.findAll(key, query, options)
    }

    static update(profile: UserProfile, broadcast?: boolean): Promise<void> {
        return userModel.updateOrCreate(profile.user.gid, profile).then(() => {
            socketManager.sendEvent(`session_${profile.user.gid}`, new SocketEvent(types.USER_UPDATE, profile))

            if (broadcast) {
                socketManager.sendEvent(`user_${profile.user.gid}`,
                    new SocketEvent(types.CONTACT_UPDATE, profile.user)
                )
            }
        })
    }

    static async getAvatar(gid: string): Promise<Buffer> {
        try {
            const { data } = await avatarsModel.get(Number(gid), true)
            return Buffer.from(data, 'base64')
        } catch (e) {
            gid = (Math.pow(Number(gid), (Math.floor(Math.sqrt(15 - gid.length))))).toString()
            const img = 'data:image/jpg;base64,' + new Identicon(gid, 150).toString()
            const data = img.replace(/^data:image\/\w+;base64,/, '')
            return Buffer.from(data, 'base64')
        }
    }

    static async uploadAvatar(gid: string, files: Object) {
        if (!files.avatar || files.avatar.truncated) {
            throw new Error('No file or size of file so large')
        }

        return avatarsModel.updateOrCreate(Number(gid), {
            _id: Number(gid),
            data: files.avatar.data.toString('base64')
        })
    }

    static getPushTokens(gid: number): Promise<Object> {
        return pushTokensModel.get(gid)
    }

    static updatePushTokens(gid: number, tokens: string[]): Promise<void> {
        return pushTokensModel.updateOrCreate(gid, { _id: gid, tokens })
    }
}
