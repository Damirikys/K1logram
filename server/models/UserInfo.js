// @flow

export interface UserInfoType {
    gid: number,
    name: string,
    bio: string,
    email: string,
    avatar: string,
}

export default class UserInfo implements UserInfoType {
    gid: number
    name: string
    bio: string
    email: string
    avatar: string

    constructor({ gid, name, bio, email, avatar }: UserInfoType) {
        this.gid = gid
        this.name = name
        this.bio = bio
        this.email = email
        this.avatar = avatar
    }
}
