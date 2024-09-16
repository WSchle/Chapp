const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE,
});

module.exports = pool.getConnection();
