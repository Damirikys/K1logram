import express from 'express'
import passport from '../auth'

export default nextApp => express.Router()
    .get('/', (req, res) => nextApp.render(req, res, '/', req.query))
    .get('/login', (req, res) => nextApp.render(req, res, '/login', req.query))
    .get('/auth', passport.authenticate('github'))
    .get('/auth/callback', passport.authenticate('github', {
        failureRedirect: '/login?error=true',
        successRedirect: '/'
    }))
