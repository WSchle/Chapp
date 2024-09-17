const express = require('express');
const userRouter = express.Router();

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const userMiddleware = require('../middlewares/userMiddleware');
const database = require('../../database/database');
const userInterface = require('../../database/user');
const { chatInterface } = require('../../database/chat');

userRouter.post('/register', userMiddleware.validateRequest, async (request, response) => {
    const requestBody = JSON.parse(request.body);

    database.then((dataConn) => {
        dataConn
            .query(
                // Check if the username already exists
                `SELECT COUNT(*) FROM users WHERE LOWER(username) = LOWER(${dataConn.escape(
                    requestBody.username
                )})`
            )
            .then(async (rows) => {
                if (rows[0]['COUNT(*)']) {
                    dataConn.end();
                    return response.status(409).send({
                        message: 'Username wird schon genutzt',
                    });
                } else {
                    const passHash = await bcrypt.hash(requestBody.password, 10); // Hash the user´s password
                    if (!passHash || !passHash.length) {
                        dataConn.end(); // Hashing Error
                        return response.status(503).send({ message: 'Server Error' });
                    } else {
                        const uid = uuid.v4(); // unique uid
                        const queryResponse = await dataConn.query(
                            `INSERT INTO users(uid, username, password) VALUES('${uid}', ${dataConn.escape(
                                requestBody.username
                            )}, '${passHash}')`
                        );
                        if (!queryResponse.affectedRows || queryResponse.warningStatus) {
                            dataConn.end(); // User was not added to Database
                            return response.status(503).send({ message: 'Server Error' });
                        } else {
                            dataConn.end(); // User was added to Database
                            return response.status(200).send({
                                message: 'Ok',
                            });
                        }
                    }
                }
            });
    });
});

userRouter.post('/login', userMiddleware.validateRequest, async (request, response) => {
    const requestBody = JSON.parse(request.body);

    database.then((dataConn) => {
        dataConn
            .query(
                // Get password to check against
                `SELECT * FROM users WHERE username = ${dataConn.escape(requestBody.username)}`
            )
            .then(async (rows) => {
                if (!rows.length) {
                    dataConn.end();
                    return response.status(404).send({
                        // Username was not found
                        message: 'Username oder Passwort inkorrekt!',
                    });
                } else {
                    const bResult = await bcrypt.compare(requestBody.password, rows[0].password);
                    // compare provided password with saved password
                    if (bResult) {
                        // Password correct
                        const jwtoken = jwt.sign(
                            {
                                username: rows[0].username,
                                userId: rows[0].uid,
                            },
                            process.env.JWTSECRET,
                            { expiresIn: '24h' } // After 24 hours the user has to login again
                        );

                        response.cookie('token', jwtoken, {
                            httpOnly: true,
                            domain: 'localhost',
                            secure: false,
                            sameSite: 'lax',
                            maxAge: 3600000 * 24,
                        });

                        const wasTokenAdded = await userInterface.updateToken(
                            rows[0].username,
                            jwtoken
                        );
                        if (wasTokenAdded) {
                            console.log('Token added');
                        } else {
                            console.log('Token not added');
                        }

                        dataConn.end();
                        return response.status(200).send({
                            message: 'Ok',
                        });
                    } else {
                        // Password incorrect
                        dataConn.end();
                        return response.status(404).send({
                            message: 'Username oder Passwort inkorrekt!',
                        });
                    }
                }
            });
    });
});

userRouter.get('/get-chats', userMiddleware.authenticateToken, async (request, response) => {
    const username = request.query.username;

    if (!username) return response.status(401).send({ message: 'Username not provided' });

    const chatIds = await userInterface.getChatIdsOfUser(username); // Get all chatId´s the user is subscribed to
    if (!chatIds) return response.status(403).send({ message: 'Username not valid' }); // There should always be global chat, so when no id is returned the username has to be incorrect

    const chats = await chatInterface.getLastChatDataByIds(chatIds, username); // Get data from the last message of the chat
    const lastSelectedChatId = await chatInterface.getLastSelectedChat(username); // Get the chatId of the last selected chat

    return response.status(200).send({ chats, lastSelectedChatId });
});

module.exports = userRouter;
