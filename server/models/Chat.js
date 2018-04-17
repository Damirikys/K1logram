// @flow

import ChatInfo from './ChatInfo'

interface ChatType {
    common: ChatInfo,
    owner?: number,
    members?: Array<number>,
}

export default class Chat implements ChatType {
    common: ChatInfo
    owner: number
    members: Array<number>

    constructor({ common, owner, members = [] }: ChatType) {
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
        }
    }
}
