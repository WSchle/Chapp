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
};

module.exports = userInterface;
