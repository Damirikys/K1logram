import React from 'react'
import PlusIcon from 'react-icons/lib/fa/plus-square-o'
import { connect } from 'react-redux'

import ChatMenuItem from './ChatMenuItem'
import ContactMenuItem from './ContactMenuItem'
import ProfileCard from './ProfileCard'

import Chat from '../server/models/Chat'
import UserInfo from '../server/models/UserInfo'
import { SHOW_CHAT_CREATE_MODAL, SHOW_CONTACT_ADD_MODAL } from '../actions/uiActions'
import computeId from '../server/utils/cantor-pairing'

type Props = {
    userGid: number,
    chats: Chat[],
    contacts: UserInfo[],
    openChatCreateModal: Function,
    openContactAddModal: Function
}

export class Menu extends React.Component<Props> {
    render() {
        const contactsArray: UserInfo[] = Object.values(this.props.contacts)
        const chatsArray: Chat[] = Object.values(this.props.chats)
        return (
            <div className="menu">
                <ProfileCard/>

                <div className="menu__chats">
                    <div className="menu__chats_divider">
                        Группы
                        <PlusIcon onClick={this.props.openChatCreateModal} className="menu__chats_plus"/>
                    </div>
                    {chatsArray.map(chat => (
                        <ChatMenuItem
                            key={chat._id}
                            chat={chat}
                        />
                    ))}

                    <div className="menu__chats_divider">
                        Контакты
                        <PlusIcon onClick={this.props.openContactAddModal} className="menu__chats_plus"/>
                    </div>
                    {contactsArray.map(contact => (
                        <ContactMenuItem
                            key={contact.gid}
                            chatId={computeId(contact.gid, this.props.userGid)}
                            contact={contact}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    userGid: state.session.user.gid,
    chats: state.chats,
    contacts: state.contacts
}), dispatch => ({
    openChatCreateModal: () => dispatch({ type: SHOW_CHAT_CREATE_MODAL }),
    openContactAddModal: () => dispatch({ type: SHOW_CONTACT_ADD_MODAL })
}))(Menu)
