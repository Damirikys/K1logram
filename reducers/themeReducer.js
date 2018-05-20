// @flow

import * as ui from '../actions/uiActions'

export default (state = false, { type }) => {
    switch (type) {
        case ui.SWITCH_THEME_ACTION:
            return !state
        default:
            return state
    }
}
