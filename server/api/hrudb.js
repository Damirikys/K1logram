// @flow

import LRU from 'lru-cache'
import fetch from 'node-fetch'
import querystring from 'querystring'
import { OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND } from 'http-status-codes'

import config from '../config'

class HrudbTimeoutError extends Error {
    constructor() {
        super('HruDB exceeded time limit.')
    }
}

class HrudbRequestError extends Error {
    constructor() {
        super('Invalid request.')
    }
}

interface RequestType {
    method: string,
    body?: ?string,
    url: string,
    headers: Object,
    validCodes: Array<number>,
    errorCodes: Array<number>
}

class Request {
    method: string
    body: ?string
    url: string
    headers: Object
    validCodes: Array<number>
    errorCodes: Array<number>

    constructor({ method, body, url, headers, validCodes, errorCodes }: RequestType) {
        this.method = method
        this.body = body
        this.url = url
        this.headers = headers
        this.validCodes = validCodes
        this.errorCodes = errorCodes
    }
}

const ATTEMPT_COUNT = 3
const FETCH_TIMEOUT = 1000 * 3
const HRUDB_BASE_URL = config.HRUDB_BASE_URL
const AUTH_HEADER = { Authorization: config.API_KEY }
const CONTENT_TYPE_HEADER = { 'Content-Type': 'plain/text' }

const CACHE = LRU({
    max: 1024 * 1024 * 1024, // 1 Gb of ascii strings,
    length: (str: string) => str.length,
    maxAge: 1000 * 60 * 60 // 1 hour
})

const _sendRequest = async (request: Request, retryOnTimeout: boolean = true): Promise<?Object> => {
    const fetchData = {
        method: request.method,
        headers: request.headers,
        timeout: retryOnTimeout ? FETCH_TIMEOUT : null,
        body: request.body || null
    }

    for (let i = 0; i < ATTEMPT_COUNT; i++) {
        try {
            const res = await fetch(request.url, fetchData) // eslint-disable-line no-await-in-loop

            if (request.validCodes.includes(res.status)) {
                return res
            }

            if (request.errorCodes.includes(res.status)) {
                throw new HrudbRequestError()
            }
        } catch (err) {
            if (err.name === 'HrudbRequestError') {
                throw err
            }
        }
    }
}

const _change = async (key: string, value: ?string, method: string): Promise<void> => {
    const res = await _sendRequest(new Request({
        method,
        body: value,
        url: `${HRUDB_BASE_URL}${key}`,
        headers: { ...AUTH_HEADER, ...CONTENT_TYPE_HEADER },
        validCodes: [CREATED, NO_CONTENT],
        errorCodes: [BAD_REQUEST]
    }), false)

    if (!res) {
        throw new HrudbTimeoutError()
    }

    CACHE.del(key)
}

const _get = async (key: string, all?: boolean = false, options?: Object = {}): Promise<string> => {
    if (CACHE.has(key)) {
        return CACHE.get(key)
    }

    const url: string = all ?
        `${HRUDB_BASE_URL}${key}/all?${querystring.stringify(options)}` :
        `${HRUDB_BASE_URL}${key}`

    const res = await _sendRequest(new Request({
        method: 'GET',
        url,
        headers: AUTH_HEADER,
        validCodes: [OK],
        errorCodes: [BAD_REQUEST, NOT_FOUND]
    }))

    if (!res) {
        throw new HrudbTimeoutError()
    }

    const value = await res.text()

    CACHE.set(key, value)

    return value
}

export const update = (key: string, value: string): Promise<void> =>
    _change(key, value, 'PUT')

export const add = (key: string, value: string): Promise<void> =>
    _change(key, value, 'POST')

export const remove = (key: string): Promise<void> =>
    _change(key, null, 'DELETE')

export const get = (key: string): Promise<string> =>
    _get(key)

export const getAll = (key: string, options?: Object): Promise<string> =>
    _get(key, true, options)
