const isNotAuthorizedOnAnotherPage = req =>
    !req.user && req.url !== '/login' && !req.url.startsWith('/auth') && !req.url.includes('static')

export default (req, res, next) => {
    if (isNotAuthorizedOnAnotherPage(req)) {
        return res.redirect('/login')
    }

    return next()
}
