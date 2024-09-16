const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const bodyparser = require('body-parser');
const socketIO = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
    },
});
require('dotenv').config();

const userRouter = require('./REST/routes/userRouter');
const { socketManager } = require('./socket/socket');

app.use(bodyparser.raw({ type: 'application/json' }));
app.use(cors());

app.use('/api/user', userRouter);

socketManager.init(socketIO);

const port = process.env.PORT;
http.listen(port, () => {
    console.log(`listening on port: ${port}`);
});
