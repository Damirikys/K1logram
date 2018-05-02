import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import generateToken from 'random-token'
import authMiddleware from './authMiddleware'
import passport from '../auth'
import fileUpload from 'express-fileupload'

export default app => app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(fileUpload())
    .use(cookieParser())
    .use(cookieSession({
        name: 'session',
        secret: generateToken(16)
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use(authMiddleware)
