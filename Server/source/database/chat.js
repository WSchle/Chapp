const database = require('./database');
const uuid = require('uuid');

const joinQuery =
    "SELECT m.chatID, m.message, m.msgdate, (SELECT u.username FROM users u WHERE u.chats LIKE '%%x%%' AND u.username != '%y%' LIMIT 1) AS username FROM messages m WHERE m.msgdate = (SELECT MAX(msgdate) FROM messages WHERE chatID = '%x%') AND m.chatID = '%x%'";

const chatInterface = {
    getLastChatDataById: (dataConn, chatId, username) => {
        return new Promise((resolve, reject) => {
            var chatData = {
                id: chatId,
                otherUser: '',
                lastMessage: '',
                lastMessageDate: null,
            };

            dataConn // Insert chatId and username, to search for, into query string
                .query(joinQuery.replace(/%x%/g, `${chatData.id}`).replace('%y%', `${username}`))
                .then((rows) => {
                    if (!rows.length) {
                        // no chat data found (chatId or username dont exist)
                        resolve(null);
                        return;
                    }

                    chatData.otherUser =
                        chatData.id == '03d3de1d-df2e-4820-81b0-54c8e8ac937c'
                            ? 'Global' // Global chat
                            : rows[0].username; // Private chat
                    chatData.lastMessage = rows[0].message;
                    chatData.lastMessageDate = rows[0].msgdate;
                    resolve(chatData);
                });
        });
    },
    getLastChatDataByIds: (chatIds, username) => {
        return new Promise((resolve, reject) => {
            var chats = [];

            database.then(async (dataConn) => {
                for (var i = 0; i < chatIds.length; i++) {
                    await chats.push(
                        // Get last message data for all provided Id´s
                        await chatInterface.getLastChatDataById(dataConn, chatIds[i], username)
                    );
                }
                while (chats.length < chatIds.length) {
                    // Wait until all message data is collected
                    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                    await sleep(100);
                }

                dataConn.end();
                resolve(chats);
            });
        });
    },
    getChatDataById: async (chatId) => {
        return new Promise(async (resolve, reject) => {
            var chatMessages = [];

            database.then((dataConn) => {
                dataConn
                    .query(
                        // Get all messages of a chat specified by Id
                        `SELECT m.messageID, m.message, m.msgdate, (SELECT u.username FROM users u WHERE m.senderID = u.uid) AS username FROM messages m WHERE m.chatID = '${chatId}' ORDER BY m.msgdate`
                    )
                    .then((rows) => {
                        if (!rows.length) {
                            resolve(null);
                            return;
                        }

                        chatMessages = rows;
                    })
                    .finally(() => {
                        dataConn.end();
                    });
            });

            while (chatMessages.length == 0) {
                // Wait until all chat messages are collected
                const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                await sleep(100);
            }
            resolve(chatMessages);
        });
    },
    getLastSelectedChat: (username) => {
        return new Promise((resolve, reject) => {
            database.then((dataConn) => {
                dataConn // Get Id for last selected chat
                    .query(`SELECT lastSelectedChat from users where username='${username}'`)
                    .then((rows) => {
                        dataConn.end();
                        resolve(rows[0].lastSelectedChat);
                    });
            });
        });
    },
    setLastSelectedChat: (chatId, username) => {
        database.then((dataConn) => {
            dataConn.query(
                // Save last selected chat Id
                `UPDATE users SET lastSelectedChat='${chatId}' WHERE username='${username}'`
            );
        });
    },
    addNewMessage: async (data) => {
        return new Promise((resolve, reject) => {
            database.then(async (dataConn) => {
                let messageId = null;
                const uid = uuid.v4(); // unique messageId
                const res = await dataConn.query(
                    // Save new message to database
                    `INSERT INTO messages VALUES ('${data.chatId}', (SELECT uid FROM users WHERE username = '${data.username}'), '${uid}', '${data.date}', '${data.message}')`
                );

                if (res.affectedRows == 1) messageId = uid; // When successfully inserted into database we set the messageId to send back to user

                dataConn.end();

                resolve(messageId);
            });
        });
    },
};

module.exports = { chatInterface };
