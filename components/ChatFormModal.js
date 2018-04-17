import React from 'react'
import { connect } from 'react-redux'

import Modal from 'react-responsive-modal'

import * as chatsActions from '../actions/chatsActions'
import * as uiActions from '../actions/uiActions'

import Chat from '../server/models/Chat'
import ChatInfo from '../server/models/ChatInfo'

type Props = {
    visible: boolean,
    createChat: Function,
    closeModal: Function
}

class ChatFormModal extends React.Component<Props> {
    onChatCreate = () => {
        const name: string = this.inputName.value

        if (name) {
            this.props.createChat(new Chat({ common: new ChatInfo({ name }) }))
            this.props.closeModal()
        }
    }

    render() {
        if (!this.props.visible) {
            return null
        }

        return (
            <Modal onClose={this.props.closeModal} open={true}>
                <div className="modal-content">
                    <p className="modal-content_title">Новый чат</p>
                    <div>
                        <input
                            type="text"
                            ref={ref => this.inputName = ref}
                            placeholder="Введите названия комнаты..."
                            className="input-text"
                        />
                    </div>
                    <div style={{ float: 'right', marginTop: '6px' }}>
                        <button onClick={this.onChatCreate} className="button button-default">Создать</button>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default connect(state => ({
    visible: state.ui[uiActions.entities.CHAT_CREATE_MODAL]
}), dispatch => ({
    createChat: (payload: Chat) => dispatch({ type: chatsActions.CREATE_ACTION, payload }),
    closeModal: () => dispatch({ type: uiActions.CLOSE_CHAT_CREATE_MODAL })
}))(ChatFormModal)
