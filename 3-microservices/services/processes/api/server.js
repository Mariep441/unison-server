'use strict';

const utils = require('../../feedbacks/api/utils.js');
const Hapi = require('@hapi/hapi');

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: { cors: true }
});

require('../../feedbacks/models/db.js');

async function init() {
    await server.register(require('@hapi/inert'));
    await server.register(require('@hapi/vision'));
    await server.register(require('@hapi/cookie'));
    await server.register(require('hapi-auth-jwt2'));

    server.validator(require('@hapi/joi'))

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);

    server.auth.strategy('session', 'cookie', {
        cookie: {
            name: "process.env.cookie_name",
            password: "process.env.cookie_password",
            isSecure: false
        },
        redirectTo: '/'
    });

    server.auth.strategy('jwt', 'jwt', {
        key: 'secretpasswordnotrevealedtoanyone',
        validate: utils.validate,
        verifyOptions: { algorithms: ['HS256'] },
    });

    server.auth.default('session');
    server.route(require('../../feedbacks/routes-api'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

init();
