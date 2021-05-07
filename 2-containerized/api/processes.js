'use strict';

const Process = require('../models/process');
const Boom = require('@hapi/boom');

const Processes = {
    find: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            const processes = await Process.find();
            return processes;
        }
    },

    findOne: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            try {
                const process = await Process.findOne({ _id: request.params.id });
                if (!process) {
                    return Boom.notFound('No Process with this id');
                }
                return process;
            } catch (err) {
                return Boom.notFound('No Process with this id');
            }
        }
    },

    create: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            const newProcess = new Process(request.payload);
            const process = await newProcess.save();
            if (process) {
                return h.response(process).code(201);
            }
            return Boom.badImplementation('error creating process');
        }
    },

    deleteAll: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            await Process.deleteMany({});
            return { success: true };
        }
    },
    deleteOne: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            const response = await Process.deleteOne({ _id: request.params.id });
            if (response.deletedCount == 1) {
                return { success: true };
            }
            return Boom.notFound('id not found');
        }
    }
};

module.exports = Processes;
