'use strict';

const utils = require('./api/utils.js');
const Hapi = require('@hapi/hapi');

const server = Hapi.server({
    port: 8000,
    routes: { cors: true }
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

    server.auth.strategy('jwt', 'jwt', {
        key: 'secretpasswordnotrevealedtoanyone',
        validate: utils.validate,
        verifyOptions: { algorithms: ['HS256'] },
    });

    server.route(require('./routes-api'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

init();

