const jwt = require('jsonwebtoken');
const userInterface = require('../../database/user');

module.exports = {
    validateRequest: (request, response, next) => {
        // For register/login REST requests when no token was supplied yet
        let requestBody;
        try {
            requestBody = JSON.parse(request.body);
        } catch (error) {
            return response.status(400).send({
                message: 'Request malformed',
            });
        }

        if (!requestBody.username || requestBody.username.length <= 3) {
            return response.status(400).send({
                message: 'username not valid',
            });
        }

        if (!requestBody.password || requestBody.password.length <= 5) {
            return response.status(400).send({
                message: 'password not valid',
            });
        }

        next();
    },
    authenticateToken: (request, response, next) => {
        // For get-chat REST requests when user was provided a token
        const cookies = request.headers.cookie?.split(';').reduce((res, item) => {
            const data = item.trim().split('=');
            return { ...res, [data[0]]: data[1] };
        }, {});

        if (!cookies) return response.status(401).send({ msg: 'Token missing' });

        const token = cookies.token;

        if (!token) return response.status(401).send({ msg: 'Token missing' });

        jwt.verify(token, process.env.JWTSECRET, (error, user) => {
            if (error) return response.status(403).send({ msg: 'Token not valid' });

            request.user = user;
            next();
        });
    },
    authenticateSocket: async (socket, next) => {
        // For Socket connection/requests which are only valid with token
        const username = socket.handshake.auth.username;
        const token = await userInterface.getToken(username);

        if (!token) next(new Error('Token missing'));
        else {
            jwt.verify(token, process.env.JWTSECRET, (error, user) => {
                if (error) {
                    next(new Error('Token invalid'));
                } else {
                    socket.user = user;
                    next();
                }
            });
        }
    },
};
