'use strict';

const User = require('./models/user');
const Hapi = require('@hapi/hapi');
const db = require('./models/db.js');

const server = Hapi.server({
    port: 3000,
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
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

// Log requests

server.route({
    method: 'GET',
    path:'/api/users',
    handler: async function (request, h) {
        const users = await User.find();
        return users;
    }
});

init();
