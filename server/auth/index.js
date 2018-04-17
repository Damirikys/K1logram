import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import config from '../config'

import { serializeUser, deserializeUser } from '../controllers/passport'

passport.use(new GitHubStrategy.Strategy({
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: config.AUTH_CALLBACK
}, (accessToken, refreshToken, profile, callback) => callback(null, profile)))

passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)

export default passport
