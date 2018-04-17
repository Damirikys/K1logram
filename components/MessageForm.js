import React from 'react'
import { connect } from 'react-redux'
import SendIcon from 'react-icons/lib/md/send'
import Message from '../server/models/Message'
import { SEND_ACTION } from '../actions/messagesActions'

type Props = {
    chatId: number,
    send: Function
}

class MessageForm extends React.Component<Props> {
    onSubmit = e => {
        e.preventDefault()

        const text: string = this.inputText.value.trim()

        if (text) {
            this.props.send(new Message({ text, chatId: this.props.chatId }))
            this.inputText.value = ''
        }
    }

    render() {
        return (
            <form className="message-form" onSubmit={this.onSubmit}>
                <input type="text"
                    className="message-form__input" ref={ref => this.inputText = ref}
                    placeholder="Введите сообщение..."
                />
                <button type="submit" onClick={this.onSubmit} className="button button-send">
                    <SendIcon/>
                </button>
            </form>
        )
    }
}

export default connect(null, dispatch => ({
    send: (payload: Message) => dispatch({ type: SEND_ACTION, payload })
}))(MessageForm)
