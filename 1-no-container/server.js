'use strict';

const utils = require('./api/utils.js');
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const moment = require('moment')


const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: { cors: true }
//    tls: {
//        key: fs.readFileSync('keys/private/webserver.key'),
//      cert: fs.readFileSync('keys/webserver.crt')
//    }
});

require('./models/db.js');

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
    server.route(require('./routes-api'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

init();
