import next from 'next'
import http from 'http'
import express from 'express'
import io from 'socket.io'

import config from './config'
import apiRouter from './routes/api'
import authRouter from './routes/auth'
import setupMiddleware from './middlewares'
import SocketManager from './socket'
import { connect } from './api/mongodb'

const expressApp = express()
const httpServer = http.Server(expressApp)
const nextApp = next({ dev: config.NODE_ENV !== 'production' })

SocketManager.init(io(httpServer))

nextApp.prepare().then(() => connect()).then(() => {
    setupMiddleware(expressApp)
        .use('/', authRouter(nextApp))
        .use('/api/v1', apiRouter)
        .get('*', nextApp.getRequestHandler())

    httpServer.listen(config.PORT)
})
