import dotenv from 'dotenv'
dotenv.config()

export default {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    AUTH_CALLBACK: process.env.AUTH_CALLBACK,
    MONGODB_URL: process.env.MONGODB_URL,
    FCM_KEY: process.env.FCM_KEY,
    FCM_PUSH_URL: 'http://fcm.googleapis.com/fcm/send'
}
