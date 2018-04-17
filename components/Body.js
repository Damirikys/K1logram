import React from 'react'
import { connect } from 'react-redux'

import io from 'socket.io-client'

import Menu from './Menu'
import ChatFormModal from './ChatFormModal'
import ContactFormModal from './ContactFormModal'
import UserProfileModal from './UserProfileModal'
import ChatBody from './ChatBody'

import UserProfile from '../server/models/UserProfile'

import * as userActions from '../actions/userActions'
import * as uiActions from '../actions/uiActions'

type Props = {
    session: UserProfile,
    queryId: number,
    initialSession: Function,
    fetchSelf: Function,
    selectChat: Function
}

class Body extends React.Component<Props> {
    componentWillMount() {
        this.props.initialSession(this.props.session)
    }

    componentDidMount() {
        const { queryId } = this.props

        if (queryId) {
            this.props.selectChat(queryId)
        }

        this.socket = io()
        this.props.fetchSelf(this.socket)
    }

    render() {
        return (
            <div className="main">
                <Menu/>

                <div className="content">
                    <ChatBody/>
                </div>

                <ChatFormModal/>
                <ContactFormModal/>
                <UserProfileModal/>
            </div>
        )
    }
}

export default connect(null, dispatch => ({
    initialSession: payload => dispatch({ type: userActions.INITIAL_SESSION_ACTION, payload }),
    fetchSelf: payload => dispatch({ type: userActions.FETCH_PROFILE_ACTION, payload }),
    selectChat: payload => dispatch({ type: uiActions.SELECT_CHAT_ACTION, payload })
}))(Body)
