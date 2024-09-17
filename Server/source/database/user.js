const database = require('./database');

const userInterface = {
    getChatIdsOfUser: async (username) => {
        return new Promise((resolve, reject) => {
            database.then((dataConn) => {
                dataConn
                    .query(`SELECT chats FROM users WHERE username='${username}'`)
                    .then((rows) => {
                        if (!rows.length) resolve(null);
                        else
                            resolve(
                                // chats format: "chatId;chatId;" split to array and remove null entries
                                rows[0].chats.split(';').filter((entry) => {
                                    if (entry != '') return entry;
                                })
                            );
                    })
                    .finally(() => {
                        dataConn.end();
                    });
            });
        });
    },
    updateToken: (username, newToken) => {
        return new Promise((resolve, reject) => {
            database.then(async (dataConn) => {
                const result = await dataConn.query(
                    `UPDATE users SET token='${newToken}' WHERE username='${username}'`
                );
                dataConn.end();
                resolve(result.affectedRows >= 1);
            });
        });
    },
    getToken: (username) => {
        return new Promise((resolve, reject) => {
            database.then((dataConn) => {
                dataConn
                    .query(`SELECT token FROM users WHERE username='${username}'`)
                    .then((rows) => {
                        dataConn.end();
                        resolve(rows[0]?.token);
                    });
            });
        });
    },
};

module.exports = userInterface;
