import React from 'react'
import { connect } from 'react-redux'

import Modal from 'react-responsive-modal'

import UserInfo from '../server/models/UserInfo'

import * as uiActions from '../actions/uiActions'

type Props = {
    data: { user: UserInfo, visible: boolean },
    closeModal: Function
}

class UserProfileModal extends React.Component<Props> {
    onCloseModal = () => this.props.closeModal()

    render() {
        const { user, visible } = this.props.data

        if (!visible) {
            return null
        }

        return (
            <Modal onClose={this.onCloseModal} open={true}>
                <div className="modal-content">
                    <p className="modal-content_title">{user.name}</p>
                    <p>{user.bio}</p>
                    <p>{user.email}</p>
                </div>
            </Modal>
        )
    }
}

export default connect(state => ({
    data: state.ui[uiActions.entities.PROFILE_MODAL]
}), dispatch => ({
    closeModal: () => dispatch({ type: uiActions.CLOSE_PROFILE_MODAL })
}))(UserProfileModal)
