import React from 'react'
import MembersIcon from 'react-icons/lib/md/group'
import TitleIcon from 'react-icons/lib/md/local-offer'
import { Dropdown } from 'semantic-ui-react'
import Chat from '../server/models/Chat'
import ChatAddMemberModal from './ChatAddMemberModal'

type Props = {
    chat: Chat
}

type State = {
    addMemberModalVisible: boolean
}

export default class ChatHeader extends React.Component<Props, State> {
    state = { addMemberModalVisible: false }

    onToggleAddMemberModal = () => {
        this.setState({ addMemberModalVisible: !this.state.addMemberModalVisible })
    }

    render() {
        const { chat } = this.props
        return (
            <div className="chat-info">
                <p className="chat-info__name">
                    <TitleIcon/> {chat.common.name}
                </p>
                <div className="chat-info__members">
                    <MembersIcon/> {chat.members.length} участников
                    <Dropdown className="chat-info__dropdown" icon="bars">
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.onToggleAddMemberModal} text="Добавить участника"/>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <ChatAddMemberModal
                    chatId={chat.common.id}
                    onClose={this.onToggleAddMemberModal}
                    visible={this.state.addMemberModalVisible}
                />
            </div>
        )
    }
}
