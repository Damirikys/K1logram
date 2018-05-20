import React from 'react'
import { connect } from 'react-redux'
import { OK } from 'http-status-codes'
import Modal from 'react-responsive-modal'
import { Dot } from 'react-animated-dots'

import API from '../api'
import UserInfo from '../server/models/UserInfo'

import { CLOSE_PROFILE_MODAL, entities } from '../actions/uiActions'
import { UPLOAD_AVATAR_SUCCESS } from '../actions/userActions'
import avatarByGid from '../utils/avatarByGid'

type Props = {
    gid: number,
    modified: number,
    data: { user: UserInfo, visible: boolean },
    uploadSuccess: Function,
    closeModal: Function
}

type State = {
    uploading: boolean
}

class UserProfileModal extends React.Component<Props, State> {
    state = { uploading: false, message: null }

    onChange = () => this.inputFile.click()

    onSelect = async e => {
        this.setState({ uploading: true, message: null })

        const response = await API.uploadAvatar(this.props.gid, e.target.files[0])

        if (response.status === OK) {
            this.setState({ uploading: false, message: null })
            this.props.uploadSuccess()
        } else {
            this.setState({ uploading: false, message: 'Максимальный размер 250kb' })
        }
    }

    render() {
        const { user, visible } = this.props.data

        if (!visible) {
            return null
        }

        return (
            <Modal onClose={this.props.closeModal} open={true}>
                <div className="modal-content">
                    <p className="modal-content_title">{user.name || 'Безымянный пользователь'}</p>
                    <div className="modal-user-profile">
                        {user.gid === this.props.gid ? (
                            <div style={{ position: 'relative' }}>
                                <img
                                    onClick={this.onChange}
                                    title="Изменить аватарку"
                                    className="modal-user-profile__avatar hoverable"
                                    src={avatarByGid(user.gid, this.props.modified)}/>
                                {this.state.message && <p className="modal-user-profile__avatar-message">{this.state.message}</p>}
                                <input
                                    ref={ref => this.inputFile = ref}
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={this.onSelect}
                                />
                                {this.state.uploading && (
                                    <div className="modal-user-profile__avatar_uploading">
                                        <p>Загрузка
                                            <Dot>.</Dot>
                                            <Dot>.</Dot>
                                            <Dot>.</Dot>
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : <img className="modal-user-profile__avatar" src={avatarByGid(user.gid)} />}
                        <div>
                            <p>{user.bio}</p>
                            <p>{user.email}</p>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default connect(state => ({
    gid: state.session.user.gid,
    modified: state.session.modified,
    data: state.ui[entities.PROFILE_MODAL]
}), dispatch => ({
    uploadSuccess: () => dispatch({ type: UPLOAD_AVATAR_SUCCESS }),
    closeModal: () => dispatch({ type: CLOSE_PROFILE_MODAL })
}))(UserProfileModal)
