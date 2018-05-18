import React from 'react'
import { connect } from 'react-redux'
import SendIcon from 'react-icons/lib/md/send'
import SmileIcon from 'react-icons/lib/fa/smile-o'
import ImageIcon from 'react-icons/lib/io/image'
import GeoIcon from 'react-icons/lib/fa/map-marker'
import RemoveIcon from 'react-icons/lib/md/clear'

import EmojiPicker from './EmojiPicker'
import Message from '../server/models/Message'
import { FORWARD_RESET, SEND_ACTION } from '../actions/messagesActions'

import ImageCompressor from '../utils/image-compressor'
import avatarByGid from '../utils/avatarByGid'

type Props = {
    chatId: number,
    users: Object,
    forwarded: Message[],
    send: Function,
    resetForwarded: Function
}

type State = {
    imgData: string
}

class MessageForm extends React.Component<Props, State> {
    state = { imgData: null }

    compressor = new ImageCompressor(
        document.createElement('canvas'),
        document.createElement('img')
    )

    showEmojiPicker = e => {
        e.preventDefault()
        this.emojiPicker.toggle()
    }

    selectEmoji = emoji => this.inputText.value += emoji.native

    attachImage(image) {
        try {
            const imgSrc = URL.createObjectURL(image)
            this.compressor.run(imgSrc, imgData => this.setState({ imgData }))
        } catch (e) {
        }
    }

    submit = e => {
        e.preventDefault()

        const text: string = this.inputText.value.trim()

        if (text || this.state.imgData || this.props.forwarded.length > 0) {
            const message: Message = new Message({
                text,
                imgUrl: this.state.imgData,
                chatId: this.props.chatId,
                forwarded: this.props.forwarded
            })

            this.props.send(message)
            this.inputText.value = ''
            this.props.resetForwarded()
            this.setState({ imgData: null })
        }
    }

    renderForwarded = () => {
        const count = this.props.forwarded.length
        if (count === 0) {
            return null
        }

        const message = this.props.forwarded[0]
        const author = this.props.users[message.authorGid] || {}

        return (
            <div className="forwarded">
                {count === 1 ? (
                    <div className="forwarded__message">
                        <img src={avatarByGid(message.authorGid)}/>
                        <p style={{ color: '#7790a9', fontWeight: 400 }}>
                            {(author.name || 'Безымянный пользователь') + ':'}
                        </p>
                        <p>{message.text || '*вложение*'}</p>
                    </div>
                ) : (
                    <p>Пересылаемых сообщений: {count}</p>
                )}
                <span onClick={this.props.resetForwarded}><RemoveIcon/></span>
            </div>
        )
    }

    render() {
        return (
            <div className="message-form-wrapper">
                {this.state.imgData && <img className="message-form-img" src={this.state.imgData}/>}
                <EmojiPicker
                    onSelect={this.selectEmoji}
                    ref={ref => this.emojiPicker = ref}/>
                <input
                    ref={ref => this.inputImage = ref}
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={event => this.attachImage(event.target.files[0])}
                    style={{ display: 'none' }}
                />
                {this.renderForwarded()}
                <form className="message-form" onSubmit={this.submit}>
                    <button type="button" onClick={() => this.inputImage.click()} className="button button-send">
                        <ImageIcon/>
                    </button>
                    <button type="button" className="button button-send">
                        <GeoIcon/>
                    </button>
                    <input
                        type="text"
                        className="message-form__input"
                        placeholder="Введите сообщение..."
                        ref={ref => this.inputText = ref}
                    />
                    <button type="button" onClick={this.showEmojiPicker} className="button button-send">
                        <SmileIcon/>
                    </button>
                    <button type="submit" onClick={this.submit} className="button button-send">
                        <SendIcon/>
                    </button>
                </form>
            </div>
        )
    }
}

export default connect(state => ({
    users: state.chatsMembers
}), dispatch => ({
    send: (payload: Message) => dispatch({ type: SEND_ACTION, payload }),
    resetForwarded: () => dispatch({ type: FORWARD_RESET })
}), null, { withRef: true })(MessageForm)
