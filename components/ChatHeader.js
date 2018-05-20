import React from 'react'
import MembersIcon from 'react-icons/lib/md/group'
import TitleIcon from 'react-icons/lib/md/local-offer'
import ForwardIcon from 'react-icons/lib/fa/mail-forward'
import Chat from '../server/models/Chat'
import ChatMembersModal from './ChatMembersModal'
import Message from '../server/models/Message'

type Props = {
    title: string,
    chat?: Chat,
    selectedMessages: Message[],
    forwardMessages: Function
}

type State = {
    membersModalVisible: boolean
}

export default class ChatHeader extends React.Component<Props, State> {
    state = { membersModalVisible: false }

    toggleMembersModal = () => {
        this.setState({ membersModalVisible: !this.state.membersModalVisible })
    }

    render() {
        const { title, chat, selectedMessages } = this.props
        return (
            <div className="chat-info">
                <p className="chat-info__name">
                    <TitleIcon/> {title}
                </p>

                {selectedMessages.length > 0 && (
                    <div className="chat-info__controls">
                        <p onClick={this.props.forwardMessages}><ForwardIcon/> <span>{selectedMessages.length}</span></p>
                    </div>
                )}

                {!selectedMessages.length && chat && (
                    <div className="chat-info__members">
                        <a href="#" onClick={this.toggleMembersModal}>
                            <MembersIcon/> {chat.members.length} участников
                        </a>

                        <ChatMembersModal
                            chatId={chat._id}
                            onClose={this.toggleMembersModal}
                            visible={this.state.membersModalVisible}
                        />
                    </div>
                )}
            </div>
        )
    }
}
