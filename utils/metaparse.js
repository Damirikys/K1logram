// @flow
import APIClient from '../api/index'
import Message from '../server/models/Message'

const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig // eslint-disable-line no-useless-escape

export const metaParse = async (message: Message) => {
    return Promise.all(message.text.match(urlRegex).map(APIClient.fetchMeta))
}

