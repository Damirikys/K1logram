import React from 'react'
import { connect } from 'react-redux'
import GroupIcon from 'react-icons/lib/md/group'
import RemoveIcon from 'react-icons/lib/md/clear'

import Chat from '../server/models/Chat'
import Message from '../server/models/Message'

import { REMOVE_ACTION } from '../actions/chatsActions'
import { SELECT_CHAT_ACTION } from '../actions/uiActions'
import avatarByGid from '../utils/avatarByGid'

type Props = {
    chat: Chat,
    modified: number,
    selected: boolean,
    message: Message,
    members: Object,
    selectChat: Function,
    removeChat: Function,
}

export class ChatItem extends React.Component<Props> {
    onSelectChat = () => this.props.selectChat(this.props.chat._id)
    onRemoveClick = () => this.props.removeChat(this.props.chat)

    render() {
        const { chat, message, selected, modified } = this.props
        return (
            <div onClick={this.onSelectChat} className={selected ? 'menu__row menu__row-selected' : 'menu__row'}>
                <div onClick={this.onRemoveClick} className="menu-row__remove"><RemoveIcon/></div>
                <p className="menu-row__title">
                    <span><GroupIcon/> {chat.common.name}</span>
                </p>
                <p className="menu-row__message">
                    {message && <img className="menu-row__message_author" src={avatarByGid(message.authorGid, modified)}/>}
                    {message
                        ? <span>{message.text ||
                                (message.imgUrl && '*изображение*') ||
                                (message.forwarded.length > 0 && '*пересланные сообщения*')
                        }</span> : <i>сообщений нет</i> }
                </p>
            </div>
        )
    }
}

export default connect((state, { chat: { _id } }) => ({
    modified: state.session.modified,
    selected: state.ui.selectedChatId === _id,
    message: state.messages[_id] && state.messages[_id][
        state.messages[_id].length - 1
    ]
}), dispatch => ({
    selectChat: payload => dispatch({ type: SELECT_CHAT_ACTION, payload }),
    removeChat: (payload: Chat) => dispatch({ type: REMOVE_ACTION, payload })
}))(ChatItem)
