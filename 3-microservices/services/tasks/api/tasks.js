'use strict';

const Task = require('../models/task');
const Process = require('../models/process');
const Boom = require('@hapi/boom');
const utils = require('./utils.js');

const Tasks = {

    find: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            const tasks = await Task.find().populate('maker').populate('checker').populate('process').lean();
            return tasks;
        }
    },

    findByProcess: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            const tasks = await Task.find({ process: request.params.id });
            return tasks;
        }
    },

    progress: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            const progress = await Task.aggregate([

                { $group: {
                        _id: "$client",
                        estimatedTimeToComplete: {$sum: "$estimatedTimeToComplete"},
                        timeSpent: {$sum: "$timeSpent"},
                        percentageOfCompletion: {$sum: "$percentageOfCompletion"}
                }
            }]);
            return progress;
        }
    },


    findOne: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            try {
                const task = await Task.findOne({ _id: request.params.id });
                if (!task) {
                    return Boom.notFound('No Task with this id');
                }
                return task;
            } catch (err) {
                return Boom.notFound('No Task with this id');
            }
        }
    },


    findOneAndUpdate: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            try {
                const userId = utils.getUserIdFromRequest(request);
                let UpdatedTask = new Task(request.payload);
                const task = await Task.findOneAndUpdate({ _id: request.params.id }, {$set: UpdatedTask}, {useFindAndModify: false});
                if (!task) {
                    return Boom.notFound('No Task with this id');
                }
                return task;
            } catch (err) {
                return Boom.notFound('No Task with this id');
            }
        }
    },

    create: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            const userId = utils.getUserIdFromRequest(request);
            let task = new Task(request.payload);
            task.creator = userId;
            task.lastUpdate = Date.now();
            task = await task.save();
            if (task) {
                return h.response(task).code(201);
            }
            return Boom.badImplementation('error creating task');
        }
    },


    addTask:  {auth: false,
        handler: async function(request, h) {
            const userId = utils.getUserIdFromRequest(request);
            let task = new Task(request.payload);
            const process = await Process.findOne({ _id: request.params.id });
            if (!process) {
                return Boom.notFound('No Process with this id');
            }
            task.process = process;
            task.creator = userId;
            task.lastUpdate = Date.now();
            task = await task.save();
            if (task) {
                return h.response(task).code(201);
            }
            return Boom.badImplementation('error creating task');
        }
    },

    deleteOne: {auth: {strategy: 'jwt',},
        handler: async function (request, h) {
            const task = await Task.deleteOne({ _id: request.params.id });
            if (task) {
                return { success: true };
            }
            return Boom.notFound('id not found');
        },
    },

    deleteAll: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            await Task.deleteMany({});
            return { success: true };
        }
    }
};

module.exports = Tasks;
