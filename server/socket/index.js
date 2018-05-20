import UserProfile from '../models/UserProfile'
import SocketEvent from '../models/SocketEvent'
import computeId from '../utils/cantor-pairing'

class SocketManager {
    clients = {}

    init(io) {
        this.io = io
        this.io.on('connection', socket => {
            socket.on('connect_auth', (client: UserProfile) => {
                try {
                    socket.join(`session_${client.user.gid}`)
                    client.chats.forEach(id => socket.join(`chat_${id}`))
                    client.contacts.forEach(id => {
                        socket.join(`chat_${computeId(id, client.user.gid)}`)
                        socket.join(`user_${id}`)
                    })
                } catch (e) {
                    console.info(e)
                }

                this.clients[client.user.gid] = true

                socket.on('disconnect', () => this.clients[client.user.gid] = false)
            })
        })
    }

    hasClient(gid: number) {
        return this.clients[gid]
    }

    sendEvent(target: string, event: SocketEvent) {
        setTimeout(() => this.io.to(target).emit(event.type, event.data))
    }
}

export default new SocketManager()
