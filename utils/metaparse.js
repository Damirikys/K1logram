// @flow
import APIClient from '../api/index'
import Message from '../server/models/Message'

const urlRegex = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig // eslint-disable-line no-useless-escape

export const metaParse = async (message: Message) => {
    const matches: string[] = message.text.match(urlRegex)
    return matches ? Promise.all(matches.map(APIClient.fetchMeta)) : null
}
