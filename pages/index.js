import React from 'react'
import Head from 'next/head'
import { Provider } from 'react-redux'

import initStore from '../store/index'

import Body from '../components/Body'

import UserProfile from '../server/models/UserProfile'
import Message from '../server/models/Message'

type Props = {
    session: UserProfile,
    messages: Array<Message>,
    url: Object
}

export default class Main extends React.Component<Props> {
    static async getInitialProps({ req }) {
        return { session: req.user }
    }

    render() {
        return (
            <Provider store={initStore()}>
                <div className="root">
                    <Head>
                        <meta charSet="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <title>Kilogram Messenger</title>
                        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"/>
                        <link rel="stylesheet" href="/static/styles/main.css"/>
                    </Head>
                    <Body queryId={Number(this.props.url.query.im)} session={this.props.session}/>
                </div>
            </Provider>
        )
    }
}
