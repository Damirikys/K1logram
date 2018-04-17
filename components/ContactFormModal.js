import React from 'react'
import { connect } from 'react-redux'

import Modal from 'react-responsive-modal'

import API from '../api/index'
import * as contactsActions from '../actions/contactsActions'
import * as uiActions from '../actions/uiActions'

import UserInfo from '../server/models/UserInfo'

type Props = {
    visible: boolean,
    addContact: Function,
    closeModal: Function
}

type State = {
    user: UserInfo,
    message: string
}

class ContactFormModal extends React.Component<Props, State> {
    state = { user: null, message: null }

    onUserSearch = () => {
        const gid: number = Number(this.inputGithubID.value)

        if (gid) {
            API.fetchContacts([gid])
                .then(response => this.setState({ user: response[gid], message: null }))
                .catch(() => this.setState({ message: 'Пользователь не найден' }))
        }
    }

    onContactAdd = () => {
        this.props.addContact(this.state.user)
        this.props.closeModal()
    }

    render() {
        if (!this.props.visible) {
            return null
        }

        return (
            <Modal onClose={this.props.closeModal} open={true}>
                <div className="modal-content">
                    <p className="modal-content_title">Новый контакт</p>
                    <div>
                        <input
                            type="number"
                            ref={ref => this.inputGithubID = ref}
                            placeholder="Введите Github ID..."
                            className="input-text"
                        />
                    </div>
                    <div style={{ float: 'right', marginTop: '6px' }}>
                        <button onClick={this.onUserSearch} className="button button-default">Найти</button>
                    </div>
                    {this.state.message && (
                        <p>{this.state.message}</p>
                    )}

                    {this.state.user && (
                        <div>
                            <p>{JSON.stringify(this.state.user, null, 2)}</p>
                            <button onClick={this.onContactAdd}>Добавить</button>
                        </div>
                    )}
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
