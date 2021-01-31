'use strict';

const Task = require('../models/task');
const Boom = require('@hapi/boom');

const Tasks = {
    find: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function(request, h) {
            const tasks = await Task.find().populate('maker').lean();
            return tasks;
        }
    },
    findByUser: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function(request, h) {
            const tasks = await Tasks.findOne({ user: request.params.id });
            return tasks;
        }
    },


    deleteOne: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function (request, h) {
            const task = await Task.deleteOne({ _id: request.params.id });
            if (task) {
                return { success: true };
            }
            return Boom.notFound('id not found');
        },
    },

    deleteAll: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function(request, h) {
            await Task.deleteMany({});
            return { success: true };
        }
    }
};

module.exports = Tasks;
