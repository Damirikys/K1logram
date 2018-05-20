import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import Message from '../server/models/Message'
import MessageItem from './Message'
import ChatHeader from './ChatHeader'
import MessageForm from './MessageForm'
import Chat from '../server/models/Chat'
import computeId from '../server/utils/cantor-pairing'
import { FORWARD_ACTION } from '../actions/messagesActions'
import { SELECT_CHAT_ACTION } from '../actions/uiActions'

type Props = {
    gid: number,
    contacts: number[],
    chat: Chat,
    chatId: number,
    forwarded: Message[],
    messages: Message[],
    reset: Function,
    forward: Function
}

type State = {
    dragzone: boolean,
    selectedMessages: Message[]
}

class ChatBody extends React.Component<Props, State> {
    state = { dragzone: false, selectedMessages: [] }

    componentWillReceiveProps(nextProps) {
        if (this.messagesBody && (this.props.messages.length !== nextProps.messages.length || this.props.chatId !== nextProps.chatId)) {
            this.setState({}, this.scrollToBottom)
        }
    }

    mountMessageBody = ref => {
        this.messagesBody = ref
        this.scrollToBottom()
    }

    scrollToBottom = () => {
        if (this.messagesBody) {
            this.messagesBody.scrollTop = this.messagesBody.scrollHeight
        }
    }

    checkDialogExist = () => {
        const { contacts, chat, chatId, gid } = this.props
        const exist: boolean = contacts.map(id => computeId(gid, id)).includes(chatId)

        if (!exist && !chat) {
            this.props.reset()
        }

        return exist || chat
    }

    dragzoneShow = () => !this.state.dragzone && this.setState({ dragzone: true })

    dragzoneHide = () => this.state.dragzone && this.setState({ dragzone: false })

    dropFile = files => {
        if (this.messageForm) {
            this.messageForm.attachImage(files[0])
        }

        this.dragzoneHide()
    }

    onSelectMessage = (message: Message, selected: boolean) => {
        const { selectedMessages } = this.state

        if (selected) {
            this.setState({ selectedMessages: [...selectedMessages, message] })
        } else {
            this.setState({ selectedMessages: selectedMessages.filter(x => x._id !== message._id) })
        }
    }

    forwardMessages = () => {
        this.props.forward(this.state.selectedMessages)
        this.props.reset()

        this.setState({ selectedMessages: [] })
    }

    render() {
        const { messages, chat, chatId, gid, forwarded } = this.props
        if (!chatId || !this.checkDialogExist()) {
            return (
                <div className="chat">
                    <span className="chat__not-selected">{forwarded.length
                        ? `Выберите диалог для пересылки сообщений`
                        : `Выберите диалог для общения`
                    }</span>
                </div>
            )
        }

        return (
            <Dropzone
                disableClick
                accept=".jpeg,.jpg,.png,.gif,.bmp"
                onDrop={this.dropFile}
                onDragEnter={this.dragzoneShow}
                onDragLeave={this.dragzoneHide}
                className="dropzone"
            >
                {this.state.dragzone && <div className="message-form-dropzone">Переместите изображение сюда...</div>}
                <div className="chat">
                    <ChatHeader
                        title={chat ? chat.common.name : 'Диалог'}
                        chat={chat}
                        selectedMessages={this.state.selectedMessages}
                        forwardMessages={this.forwardMessages}
                    />
                    <div className="messages" ref={this.mountMessageBody}>
                        {messages.map(message => (
                            <MessageItem
                                key={message._id}
                                mine={message.authorGid === gid}
                                message={message}
                                onLoad={this.scrollToBottom}
                                onSelectMessage={this.onSelectMessage}
                            />
                        ))}
                    </div>
                    <MessageForm
                        ref={ref => ref && (this.messageForm = ref.getWrappedInstance())}
                        forwarded={forwarded}
                        chatId={chatId}
                    />
                </div>
            </Dropzone>
        )
    }
}

export default connect(state => ({
    gid: state.session.user.gid,
    contacts: state.session.contacts,
    chat: state.chats[state.ui.selectedChatId],
    chatId: state.ui.selectedChatId,
    forwarded: state.forwarded,
    messages: (state.messages[state.ui.selectedChatId] && [...state.messages[state.ui.selectedChatId]]) || []
}), dispatch => ({
    reset: () => dispatch({ type: SELECT_CHAT_ACTION, payload: null }),
    forward: payload => dispatch({ type: FORWARD_ACTION, payload })
}))(ChatBody)
