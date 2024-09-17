const moment = require('moment');
const userMiddleware = require('../REST/middlewares/userMiddleware');
const { chatInterface } = require('../database/chat');

const socketManager = {
    allChats: null, // "/chat" namespace
    init: (_io) => {
        socketManager.allChats = _io.of('/chat');
        socketManager.allChats.use(userMiddleware.authenticateSocket); // Always check socket.handshake for jsonwebtoken and its validity)
        socketManager.allChats.on('connection', socketManager.onConnection);
    },
    onConnection: (socket) => {
        // Callback for a newly connected user
        console.log(`⚡: ${socket.id} user just connected to Chat!`);

        socket.on('chat:join', async (chatId, username, callback) => {
            // Callback for user joining a room
            socket.join(chatId);
            chatInterface.setLastSelectedChat(chatId, username); // Save the last selected chatId
            const chatMessages = await chatInterface.getChatDataById(chatId); // Get all messages from a chat
            callback(chatMessages); // send chat messages back to client
        });

        socket.on('chat:leave', (chatId, username) => {
            socket.leave(chatId);
        });

        socket.on('chat:message', async (chatId, username, message, callback) => {
            // Callback for a new message by client
            const date = moment().format('YYYY-MM-DD HH:mm:ss');
            const messageId = await chatInterface.addNewMessage({
                // Add Message to Database
                chatId,
                username,
                message,
                date,
            });

            if (messageId)
                socketManager.allChats.in(chatId).emit('message:new', {
                    // Emit new message to all clients in the specified room
                    chatId,
                    messageId,
                    username,
                    message,
                    date,
                });

            callback(messageId != null); // Send bool to user so they know if the message was registered
        });

        socket.on('disconnect', () => {
            console.log('🔥: A user disconnected');
        });
    },
};

module.exports = {
    socketManager,
};
