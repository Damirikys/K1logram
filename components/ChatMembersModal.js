import React from 'react'
import { connect } from 'react-redux'

import Modal from 'react-responsive-modal'

import * as chatsActions from '../actions/chatsActions'

import UserInfo from '../server/models/UserInfo'
import noavatar from '../utils/avatarByGid'
import Chat from '../server/models/Chat'

type Props = {
    chatId: number,
    chat: Chat,
    members: Object,
    contacts: Object,
    onClose: Function,
    visible: boolean,
    doAction: Function
}

class ChatMembersModal extends React.Component<Props> {
    inviteMember = gid => this.props.doAction(chatsActions.ADD_MEMBER_ACTION, this.props.chatId, gid)
    excludeMember = gid => this.props.doAction(chatsActions.REMOVE_MEMBER_ACTION, this.props.chatId, gid)
    handleFocus = e => e.target.select()

    render() {
        const { chat, members, contacts } = this.props
        const contactsArray: UserInfo[] = Object.values(contacts).filter(x => !chat.members.includes(x.gid))
        return (
            <Modal onClose={this.props.onClose} open={this.props.visible}>
                <div className="modal-content">
                    <p className="modal-content_title">Участники</p>
                    <div className="invite-link" style={{ display: 'flex' }}>
                        <span className="invite-link__title">Ссылка для приглашения</span>
                        <input
                            className="input-text"
                            type="text"
                            value={`http://${window.location.host}/?invite=${chat._id}`} //eslint-disable-line
                            onFocus={this.handleFocus}
                        />
                    </div>
                    <div className="user-list">
                        {chat.members.map(gid => members[gid]).filter(Boolean).map(user => (
                            <div className="user-info" key={user.gid}>
                                <img className="user-info__avatar" src={noavatar(user.gid)}/>
                                <div className="user-info__body">
                                    <p>{user.name}</p>
                                    <p>{user.email}</p>
                                </div>
                                <button className="button button-default" onClick={() => this.excludeMember(user.gid)}>
                                    исключить
                                </button>
                            </div>
                        ))}
                        {contactsArray.length !== 0 && (
                            <div>
                                <p className="modal-content_divider">Пригласить из контактов</p>
                                {contactsArray.map(user => (
                                    <div className="user-info" key={user.gid}>
                                        <img className="user-info__avatar" src={noavatar(user.gid)}/>
                                        <div className="user-info__body">
                                            <p>{user.name}</p>
                                            <p>{user.email}</p>
                                        </div>
                                        <button className="button button-default" onClick={() => this.inviteMember(user.gid)}>
                                            добавить
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        )
    }
}

export default connect((state, { chatId }) => ({
    chat: state.chats[chatId],
    members: state.chatsMembers,
    contacts: state.contacts
}), dispatch => ({
    doAction: (type: string, chatId: number, gid: number) => dispatch({ type, payload: { chatId, gid } })
}))(ChatMembersModal)
