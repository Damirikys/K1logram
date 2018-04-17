import React from 'react'
import { connect } from 'react-redux'
import GroupIcon from 'react-icons/lib/md/group'
import RemoveIcon from 'react-icons/lib/md/clear'

import Chat from '../server/models/Chat'
import Message from '../server/models/Message'

import { REMOVE_ACTION } from '../actions/chatsActions'
import { SELECT_CHAT_ACTION } from '../actions/uiActions'
import noavatar from '../utils/noavatar'

type Props = {
    chat: Chat,
    selected: boolean,
    message: Message,
    members: Object,
    selectChat: Function,
    removeChat: Function,
}

export class ChatItem extends React.Component<Props> {
    onSelectChat = () => this.props.selectChat(this.props.chat.common.id)

    onRemoveClick = () => this.props.removeChat(this.props.chat)

    render() {
        const { chat, message, selected } = this.props

        return (
            <div onClick={this.onSelectChat} className={selected ? 'menu__row menu__row-selected' : 'menu__row'}>
                <div onClick={this.onRemoveClick} className="menu-row__remove"><RemoveIcon/></div>
                <p className="menu-row__title">
                    <span><GroupIcon/> {chat.common.name}</span>
                </p>
                <div className="menu-row__message">
                    {message
                        ? <p><img className="menu-row__message_author" src={noavatar(message.authorGid)}/>{message.text}</p>
                        : <i>сообщений нет</i>
                    }
                </div>
            </div>
        )
    }
}

export default connect((state, { chat: { common: { id } } }) => ({
    selected: state.ui.selectedChatId === id,
    message: state.messages[id] && state.messages[id][
        state.messages[id].length - 1
    ]
}), dispatch => ({
    selectChat: payload => dispatch({ type: SELECT_CHAT_ACTION, payload }),
    removeChat: (payload: Chat) => dispatch({ type: REMOVE_ACTION, payload })
}))(ChatItem)
