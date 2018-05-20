import React from 'react'
import ClickOutside from 'react-click-outside'
import { Picker } from 'emoji-mart'

type Props = {
    onSelect: Function
}

type State = {
    isVisible: boolean
}

export default class EmojiPicker extends React.Component<Props, State> {
    state = { isVisible: false }

    toggle = () => this.setState({ isVisible: !this.state.isVisible })

    handleClickOutside = () => this.state.isVisible && this.toggle()

    isVisible = () => this.state.isVisible

    render() {
        if (!this.state.isVisible) {
            return null
        }

        return (
            <ClickOutside onClickOutside={this.handleClickOutside}>
                <Picker onSelect={this.props.onSelect} set="apple"/>
            </ClickOutside>
        )
    }
}
