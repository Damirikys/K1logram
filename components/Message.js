import React from 'react'
import { connect } from 'react-redux'
import LinesEllipsis from 'react-lines-ellipsis'
import MarkdownRenderer from 'react-markdown-renderer'

import Message from '../server/models/Message'
import UserInfo from '../server/models/UserInfo'
import noavatar from '../utils/noavatar'
import { metaParse } from '../utils/metaparse'
import { SHOW_PROFILE_MODAL } from '../actions/uiActions'

type Props = {
    users: Object,
    message: Message,
    mine: Boolean,
    showProfile: Function
}

type State = {
    metadata: Object[]
}

const markdownOptions = {
    preset: 'default',
    html: false,
    linkify: true,
    typographer: true,
    quotes: '“”‘’'
}

class MessageItem extends React.Component<Props, State> {
    state = { metadata: [] }

    async componentDidMount() {
        const response = await metaParse(this.props.message)

        if (response) {
            this.setState({ metadata: response })
        }
    }

    renderMetadata = (data, index) => (
        <a key={index} href={data.url} target="_blank">
            <div className="link-metadata">
                <div className="link-metadata__image">
                    <img src={data.image}/>
                </div>
                <div className="link-metadata__body">
                    <p className="link-metadata__body_title">{data.title}</p>
                    <p className="link-metadata__body_description">
                        <LinesEllipsis
                            text={data.description}
                            maxLine="2"
                            ellipsis="..."
                            trimRight
                            basedOn="letters"
                        />
                    </p>
                    <p className="link-metadata__body_url">{data.url}</p>
                </div>
            </div>
        </a>
    )

    render() {
        const { message, users } = this.props
        const { metadata } = this.state
        const author: UserInfo = users[message.authorGid] || {}
        return (
            <div
                style={{ opacity: message.clusterId < 0 ? 0.5 : 1 }}
                className={this.props.mine ? 'message message-right' : 'message'}
            >
                <div className="message__avatar" onClick={() => this.props.showProfile(author)}>
                    <img src={noavatar(author.gid)} title={author.name}/>
                </div>
                <div className="message-box">
                    <div className="message-box__text">
                        <MarkdownRenderer
                            markdown={message.text}
                            options={markdownOptions}
                        />
                    </div>
                    <div className="message_box__metadata">
                        {metadata.map(this.renderMetadata)}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    users: state.chatsMembers
}), dispatch => ({
    showProfile: payload => dispatch({ type: SHOW_PROFILE_MODAL, payload })
}))(MessageItem)
