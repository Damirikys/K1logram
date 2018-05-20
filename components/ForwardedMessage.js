import React from 'react'
import { connect } from 'react-redux'
import Message from '../server/models/Message'
import UserInfo from '../server/models/UserInfo'

import avatarByGid from '../utils/avatarByGid'
import { FETCH_MEMBERS_ACTION } from '../actions/chatsActions'

type Props = {
    message: Message,
    nested: boolean,
    chatsMembers: Object,
    fetchUser: Function
}

class ForwardedMessage extends React.Component<Props> {
    componentDidMount() {
        const author = this.props.chatsMembers[this.props.message.authorGid]
        if (!author) {
            this.props.fetchUser(this.props.message.authorGid)
        }
    }

    render() {
        const { message, nested, chatsMembers } = this.props
        const author: UserInfo = chatsMembers[message.authorGid] || {}
        return (
            <div className={`message-forwarded${nested ? ' forwarded-nested' : ''}`}>
                <img src={avatarByGid(message.authorGid)}/>
                <div className="message-forwarded__body">
                    <p className="message-forwarded__body-name">{author.name || 'Неизвестный отправитель'}</p>
                    <p>{message.text || '*вложение*'}</p>
                    {message.forwarded.map(message => (
                        <ForwardedMessageConnected key={message._id} message={message} nested/>
                    ))}
                </div>
            </div>
        )
    }
}

const ForwardedMessageConnected = connect(state => ({
    chatsMembers: state.chatsMembers
}), dispatch => ({
    fetchUser: gid => dispatch({ type: FETCH_MEMBERS_ACTION, payload: [gid] })
}))(ForwardedMessage)

export default ForwardedMessageConnected
