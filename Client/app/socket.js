'use client';
import { io } from 'socket.io-client';

let instance = null;

let listeners = {};

export const socket = {
    get: () => {
        return instance;
    },
    set: (_socket) => {
        instance = _socket;
    },
    init: (username, _onConnectError) => {
        // Initiate SocketIO with our username
        socket.set(
            io('http://localhost:3030/chat', {
                auth: { username }, // This will be used to add the jsonwebtoken to the socket cookies
            })
        );

        socket.addListener('connect_error', _onConnectError);
    },
    cleanUp: () => {
        Object.keys(listeners).forEach((key) => {
            socket.get().off(key, listeners[key]); // Unregister any listeners we have saved
            delete listeners[key]; // delete listener from saved listeners
        });
    },
    addListener: (eventName, callback) => {
        try {
            socket.get().on(eventName, callback); // Register listener on provided event with provided callback
        } catch (err) {
            console.log(err);
        }

        listeners[eventName] = callback;
    },
    removeListener: (eventName, callback) => {
        // Same as "cleanUp" but for a single specific listener
        socket.get().off(eventName, callback);
        delete listeners[eventName];
    },
};
