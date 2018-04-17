import React from 'react'
import { connect } from 'react-redux'
import Message from '../server/models/Message'
import MessageItem from './Message'
import ChatHeader from './ChatHeader'
import MessageForm from './MessageForm'
import Chat from '../server/models/Chat'

type Props = {
    gid: number,
    chat: Chat,
    messages: Message[],
}

class ChatBody extends React.Component<Props> {
    componentDidMount() {
        this.scrollToBottom()
    }

    componentDidUpdate() {
        this.scrollToBottom()
    }

    scrollToBottom = () => {
        if (this.messagesBody) {
            this.messagesBody.scrollTop = this.messagesBody.scrollHeight
        }
    }

    render() {
        if (!this.props.chat) {
            return null
        }

        const { messages, chat, gid } = this.props
        return (
            <div className="chat">
                <ChatHeader chat={chat} />
                <div className="messages" ref={ref => this.messagesBody = ref}>
                    {messages.map(message => (
                        <MessageItem
                            key={message.createdAt}
                            mine={message.authorGid === gid}
                            message={message}
                        />
                    ))}
                </div>
                <MessageForm chatId={chat.common.id}/>
            </div>
        )
    }
}

export default connect(state => ({
    gid: state.session.user.gid,
    chat: state.chats[state.ui.selectedChatId],
    messages: (state.messages[state.ui.selectedChatId] && [...state.messages[state.ui.selectedChatId]]) || []
}))(ChatBody)
