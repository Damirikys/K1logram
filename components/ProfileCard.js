import React from 'react'
import { connect } from 'react-redux'

import UserInfo from '../server/models/UserInfo'
import avatarByGid from '../utils/avatarByGid'

import { SHOW_PROFILE_MODAL, SWITCH_THEME_ACTION } from '../actions/uiActions'

type Props = {
    user: UserInfo,
    theme: boolean,
    modified: number,
    showProfile: Function,
    switchTheme: Function
}

class ProfileCard extends React.Component<Props> {
    onShowProfile = () => this.props.showProfile(this.props.user)
    switchTheme = e => {
        e.stopPropagation()
        this.props.switchTheme()
    }

    render() {
        const { user, modified } = this.props
        return (
            <div onClick={this.onShowProfile} className="profile-card">
                <div className="profile-card__avatar">
                    <img src={avatarByGid(user.gid, modified)}/>
                </div>
                <div className="profile-card__body">
                    <p className="profile-card__body_name">{user.name}</p>
                    <p className="profile-card__body_bio">{user.bio}</p>
                    <p className="profile-card__body_email">{user.email}</p>
                    <p onClick={this.switchTheme} className="profile-card__body_switcher">сменить тему</p>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    theme: state.theme,
    user: state.session.user,
    modified: state.session.modified
}), dispatch => ({
    showProfile: payload => dispatch({ type: SHOW_PROFILE_MODAL, payload }),
    switchTheme: () => dispatch({ type: SWITCH_THEME_ACTION })
}))(ProfileCard)
