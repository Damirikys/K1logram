import React from 'react'
import { connect } from 'react-redux'
import { Dot } from 'react-animated-dots'

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
    im: number,
    invite: number,
    theme: boolean,
    restored: boolean,
    online: boolean,
    session: UserProfile,
    initialSession: Function,
    fetchSelf: Function,
    selectChat: Function
}

type State = {
    connected: boolean
}

class Body extends React.Component<Props, State> {
    state = { connected: false }

    componentWillMount() {
        if (typeof this.props.session === 'object') {
            this.props.initialSession(this.props.session)
        }
    }

    componentWillReceiveProps(props) {
        if (props.online && !this.props.online) {
            this.props.fetchSelf()
        }
    }

    componentDidMount() {
        const { selectChat, fetchSelf, im, invite } = this.props

        Body.SOCKET_CLIENT = io({
            reconnection: true,
            reconnectionDelay: 500
        })

        Body.SOCKET_CLIENT.on('connect', () => this.setState({ connected: true }))
        Body.SOCKET_CLIENT.on('disconnect', () => this.setState({ connected: false }))

        fetchSelf(invite)
        selectChat(im || invite)
    }

    render() {
        return (
            <div>
                {this.props.theme && <link rel="stylesheet" href="/styles/dark.css"/>}
                {(!this.state.connected || !this.props.online) && (
                    <div className="line-offline">
                        <span>Нет подключения
                            <Dot>.</Dot>
                            <Dot>.</Dot>
                            <Dot>.</Dot>
                        </span>
                    </div>
                )}
                <div className="main">
                    <Menu/>
                    <div className="content">
                        <ChatBody/>
                    </div>
                    <ChatFormModal/>
                    <ContactFormModal/>
                    <UserProfileModal/>
                </div>
            </div>
        )
    }
}

export const socketClient = () => Body.SOCKET_CLIENT

export default connect(state => ({
    theme: state.theme,
    online: state.offline.online
}), dispatch => ({
    initialSession: payload => dispatch({ type: userActions.INITIAL_SESSION_ACTION, payload }),
    fetchSelf: invite => dispatch({ type: userActions.FETCH_PROFILE_ACTION, payload: invite }),
    selectChat: payload => dispatch({ type: uiActions.SELECT_CHAT_ACTION, payload })
}))(Body)
