import React from 'react'
import { connect } from 'react-redux'

import Modal from 'react-responsive-modal'

import * as chatsActions from '../actions/chatsActions'

import UserInfo from '../server/models/UserInfo'

type Props = {
    chatId: number,
    contacts: Object,
    onClose: Function,
    visible: boolean,
    addMember: Function
}

type State = {
    selectedGid: number
}

class ChatAddMemberModal extends React.Component<Props, State> {
    state = { selectedGid: null }

    selectUser = (selectedGid: number) => {
        this.setState({ selectedGid })
    }

    onAddMemberClick = () => {
        this.props.addMember(this.props.chatId, this.state.selectedGid)
        this.props.onClose()
    }

    render() {
        const { contacts } = this.props
        const { selectedGid } = this.state
        const contactsArray: UserInfo[] = Object.values(contacts)
        return (
            <Modal onClose={this.props.onClose} open={this.props.visible}>
                <div className="modal-content">
                    <p className="modal-content_title">Добавить участника</p>
                    <div className="user-list">
                        {contactsArray.map(user => (
                            <div
                                className={selectedGid === user.gid ?
                                    'user-item user-item-selected' :
                                    'user-item'
                                }
                                onClick={() => this.selectUser(user.gid)}
                                key={user.gid}
                            >
                                <p>{user.name}</p>
                                <p>{user.bio}</p>
                                <p>{user.email}</p>
                            </div>
                        ))}
                    </div>
                    {selectedGid && (
                        <div style={{ float: 'right', marginTop: '6px' }}>
                            <button onClick={this.onAddMemberClick} className="button button-default">
                                Добавить
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        )
    }
}

export default connect(state => ({
    contacts: state.contacts
}), dispatch => ({
    addMember: (chatId: number, gid: number) => dispatch({
        type: chatsActions.ADD_MEMBER_ACTION,
        payload: { chatId, gid }
    })
}))(ChatAddMemberModal)
