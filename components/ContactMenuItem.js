import React from 'react'
import { connect } from 'react-redux'
import RemoveIcon from 'react-icons/lib/md/clear'

import UserInfo from '../server/models/UserInfo'
import Message from '../server/models/Message'

import { SELECT_CHAT_ACTION } from '../actions/uiActions'
import { REMOVE_ACTION } from '../actions/contactsActions'
import avatarByGid from '../utils/avatarByGid'

type Props = {
    chatId: number,
    message: Message,
    contact: UserInfo,
    selected: boolean,
    selectChat: Function,
    removeContact: Function
}

class ContactMenuItem extends React.Component<Props> {
    onSelectChat = () => this.props.selectChat(this.props.chatId)
    onRemoveClick = () => this.props.removeContact(this.props.contact.gid)

    render() {
        const { contact, selected, message } = this.props
        return (
            <div onClick={this.onSelectChat} className={selected ? 'menu__row menu__row-selected' : 'menu__row'}>
                <img src={avatarByGid(contact.gid)} className="menu-row__avatar"/>
                <div onClick={this.onRemoveClick} className="menu-row__remove"><RemoveIcon/></div>
                <div className="menu-row__contact">
                    <p className="menu-row__title">
                        <span>{contact.name || 'Безымянный пользователь'}</span>
                    </p>
                    <p className="menu-row__message">
                        {message
                            ? <span>{message.text ||
                                    (message.imgUrl && '*изображение*') ||
                                    (message.forwarded.length > 0 && '*пересланные сообщения*')}
                            </span> : <i>сообщений нет</i>}
                    </p>
                </div>
            </div>
        )
    }
}

export default connect((state, { chatId }: { chatId: number }) => ({
    selected: state.ui.selectedChatId === chatId,
    message: state.messages[chatId] && state.messages[chatId][
        state.messages[chatId].length - 1
    ]
}), dispatch => ({
    selectChat: payload => dispatch({ type: SELECT_CHAT_ACTION, payload }),
    removeContact: (gid: number) => dispatch({ type: REMOVE_ACTION, payload: [gid] })
}))(ContactMenuItem)
