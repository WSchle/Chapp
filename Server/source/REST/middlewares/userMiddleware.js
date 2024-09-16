const jwt = require('jsonwebtoken');

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
        const authHeader = request.headers['authorization'];
        const token = authHeader.split(' ')[1] || null;

        if (!token) return response.status(401).send({ msg: 'Token missing' });

        jwt.verify(token, process.env.JWTSECRET, (error, user) => {
            if (error) return response.status(403).send({ msg: 'Token not valid' });

            request.user = user;
            next();
        });
    },
    authenticateSocket: (socket, next) => {
        // For Socket connection/requests which are only valid with token
        const token = socket.handshake.auth.token;
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
