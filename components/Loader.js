import React from 'react'
import { connect } from 'react-redux'

type Props = {
    restored: boolean,
    body: any
}

class Loader extends React.Component<Props> {
    render() {
        if (this.props.restored) {
            return this.props.body
        }

        return (
            <div>
                <span className="body-loader">
                    <img src="/img/ripple.svg" />
                    <p className="body-loader__title">k1logram</p>
                </span>
            </div>
        )
    }
}

export default connect(state => ({
    restored: state.ui.restored
}))(Loader)
