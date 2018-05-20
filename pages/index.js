import React from 'react'
import Head from 'next/head'
import { Provider } from 'react-redux'

import initStore from '../store/index'

import Loader from '../components/Loader'
import Body from '../components/Body'

import UserProfile from '../server/models/UserProfile'
import Message from '../server/models/Message'

import ServiceWorkerManager from '../serviceWorker'

type Props = {
    session: UserProfile,
    messages: Array<Message>,
    url: Object
}

export default class Main extends React.Component<Props> {
    static getInitialProps({ req }) {
        return { session: req.user }
    }

    im = this.props.url.query.im ? this.props.url.query.im.replace(' ', '+') : null
    invite = this.props.url.query.invite ? this.props.url.query.invite.replace(' ', '+') : null

    async componentDidMount() {
        const worker = await navigator.serviceWorker.ready
        ServiceWorkerManager.attach(worker, Notification.requestPermission)
    }

    render() {
        return (
            <Provider store={initStore()}>
                <div className="root">
                    <Head>
                        <meta charSet="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <title>Kilogram Messenger</title>
                        <link rel="shortcut icon" type="image/png" href="/img/kettlebell.png"/>
                        <link rel="manifest" href="/manifest.json"/>
                        <link rel="stylesheet" href="/styles/main.css"/>
                        <link rel="stylesheet" href="/styles/emoji.css"/>
                        <script type="text/javascript" src="//www.gstatic.com/firebasejs/3.6.8/firebase.js"/>
                        <script type="text/javascript" src="/push-subscribe.js"/>
                    </Head>
                    <Loader body={(
                        <Body
                            im={Number(this.im)}
                            invite={Number(this.invite)}
                            session={this.props.session}
                        />
                    )}/>
                </div>
            </Provider>
        )
    }
}
