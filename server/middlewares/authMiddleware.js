import { UNAUTHORIZED } from 'http-status-codes'

const isNotAuthorizedOnAnotherPage = req =>
    !req.user && req.url !== '/login' &&
    !req.url.startsWith('/auth') &&
    !req.url.startsWith('/_next')

export default (req, res, next) => {
    if (!req.user && req.url.startsWith('/api/')) {
        return res.sendStatus(UNAUTHORIZED)
    }

    if (isNotAuthorizedOnAnotherPage(req)) {
        return res.redirect('/login')
    }

    return next()
}
