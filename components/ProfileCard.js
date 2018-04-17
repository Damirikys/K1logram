import React from 'react'
import { connect } from 'react-redux'

import UserInfo from '../server/models/UserInfo'
import noavatar from '../utils/noavatar'

import { SHOW_PROFILE_MODAL } from '../actions/uiActions'

type Props = {
    user: UserInfo,
    showProfile: Function
}

class ProfileCard extends React.Component<Props> {
    onShowProfile = () => this.props.showProfile(this.props.user)

    render() {
        const { user } = this.props
        return (
            <div onClick={this.onShowProfile} className="profile-card">
                <div className="profile-card__avatar">
                    <img src={noavatar(user.gid)}/>
                </div>
                <div className="profile-card__body">
                    <p className="profile-card__body_name">{user.name}</p>
                    <p className="profile-card__body_bio">{user.bio}</p>
                    <p className="profile-card__body_email">{user.email}</p>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    user: state.session.user
}), dispatch => ({
    showProfile: payload => dispatch({ type: SHOW_PROFILE_MODAL, payload })
}))(ProfileCard)
