import * as actions from '../actions/messagesActions'

import Message from '../server/models/Message'

export default (state: Message[] = [], { type, payload }): Message[] => {
    switch (type) {
        case actions.FORWARD_ACTION:
            return payload
        case actions.FORWARD_RESET:
            return []
        default:
            return state
    }
}
