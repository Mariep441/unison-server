'use strict';

const User = require('./models/user');
const Task = require('./models/task');
const utils = require('./controllers/utils.js');
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');

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

    /*
    server.auth.strategy('session', 'cookie', {
        cookie: {
            name: 'process.env.cookie_name',
            password: 'process.env.cookie_password',
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

*/



}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

// Users API

server.route({
    method: 'GET',
    path:'/api/users',
    handler: async function (request, h) {
        const users = await User.find();
        return users;
    }
});

server.route({
    method: 'GET',
    path:'/api/users/{id}',
    handler: async function (request, h) {
        const user = await User.findOne();
        return user;
    }
});

server.route({
    method: 'POST',
    path:'/api/users',
    handler: async function (request, h) {
        const newUser = new User(request.payload);
        const user = await newUser.save();
        if (user) {
            return h.response(user).code(201);
        }
        return Boom.badImplementation('error creating user');
    }
});




server.route({
    method: 'GET',
    path:'/api/tasks',
    handler: async function (request, h) {
        const tasks = await Task.find();
        return tasks;
    }
});


init();
