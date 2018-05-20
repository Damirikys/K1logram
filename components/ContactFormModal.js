import React from 'react'
import { connect } from 'react-redux'

import Modal from 'react-responsive-modal'

import API from '../api/index'
import * as contactsActions from '../actions/contactsActions'
import * as uiActions from '../actions/uiActions'

import UserInfo from '../server/models/UserInfo'
import noavatar from '../utils/avatarByGid'

type Props = {
    visible: boolean,
    addContact: Function,
    closeModal: Function
}

type State = {
    users: UserInfo[]
}

class ContactFormModal extends React.Component<Props, State> {
    state = { users: [] }

    onSearch = async () => {
        const query: string = this.inputName.value.trim()

        if (query) {
            const users: UserInfo[] = await API.findContacts(this.inputName.value.trim())
            this.setState({ users })
        }
    }

    addContact = user => {
        this.props.addContact(user)
        this.props.closeModal()
    }

    render() {
        if (!this.props.visible) {
            return null
        }

        return (
            <Modal onClose={this.props.closeModal} open={true}>
                <div className="modal-content">
                    <p className="modal-content_title">Поиск контактов</p>
                    <div>
                        <input
                            type="text"
                            ref={ref => this.inputName = ref}
                            onChange={this.onSearch}
                            placeholder="Введите имя пользователя"
                            className="input-text"
                        />
                    </div>

                    {this.state.users.map(user => (
                        <div className="user-info" key={user.gid}>
                            <img className="user-info__avatar" src={noavatar(user.gid)}/>
                            <div className="user-info__body">
                                <p>{user.name}</p>
                                <p>{user.email}</p>
                            </div>
                            <button className="button button-default" onClick={() => this.addContact(user)}>Добавить</button>
                        </div>
                    ))}
                </div>
            </Modal>
        )
    }
}

export default connect(state => ({
    visible: state.ui[uiActions.entities.CONTACT_ADD_MODAL]
}), dispatch => ({
    addContact: (user: UserInfo) => dispatch({ type: contactsActions.ADD_ACTION, payload: [user] }),
    closeModal: () => dispatch({ type: uiActions.CLOSE_CONTACT_ADD_MODAL })
}))(ContactFormModal)
