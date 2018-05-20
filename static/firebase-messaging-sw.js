/* eslint-disable */

importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-messaging.js');

firebase.initializeApp({ messagingSenderId: '227656153170' });

const messaging = firebase.messaging()
