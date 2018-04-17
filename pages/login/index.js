import React from 'react'
import Link from 'next/link'
import Head from 'next/head'

export default class LoginPage extends React.Component {
    render() {
        return (
            <div className="login_page">
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>Kilogram Messenger</title>
                    <link rel="stylesheet" href="/static/styles/login.css"/>
                </Head>
                <main className="main">
                    <h1 className="main_hello">Hello!</h1>
                    <Link href="/auth">
                        <a>
                            <button className="main_login">GitHub</button>
                        </a>
                    </Link>
                </main>
                <footer className="footer">
                    <p className="footer_copyright">&copy;Team6</p>
                    <a className="footer_github_link" href="https://github.com/">Link to GitHub</a>
                </footer>
            </div>
        )
    }
}
