// @flow

import ChatInfo from './ChatInfo'
import computeId from '../utils/cantor-pairing'

interface ChatType {
    _id: number,
    common: ChatInfo,
    owner?: number,
    members?: Array<number>,
}

export default class Chat implements ChatType {
    _id: number
    common: ChatInfo
    owner: number
    members: Array<number>

    constructor({ common, owner, members = [] }: ChatType) {
        this._id = owner ? computeId(Math.trunc(owner / 21), Math.trunc(common.createdAt / 321)) : -1
        this.common = common
        this.members = members
        this.setOwner(owner)
    }

    setOwner(gid?: number) {
        if (gid) {
            this.owner = gid

            if (!this.members.find(member => member === gid)) {
                this.members.push(gid)
            }

            this._id = computeId(Math.trunc(gid / 21), Math.trunc(this.common.createdAt / 321))
        }
    }
}
