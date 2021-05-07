'use strict';

const Feedback = require('../models/feedback');
const Boom = require('@hapi/boom')
const utils = require('./utils.js');

const Feedbacks = {
    find: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            const feedbacks = await Feedback.find();
            return feedbacks;
        }
    },

    findByTask: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            const feedbacks = await Feedback.find({ task: request.params.id });
            return feedbacks;
        }
    },

    create: {auth: false,
        handler: async function(request, h) {
            const userId = utils.getUserIdFromRequest(request);
            let feedback = new Feedback(request.payload);
            const task = await Task.findOne({task: request.params.id });
            if (!task) {
                return Boom.notFound('No Task with this id');
            }
            feedback.task = task._id;
            feedback.user = userId;
            feedback = await feedback.save();
            if (feedback) {
                return h.response(feedback).code(201);
            }
            return Boom.badImplementation('error creating feedback');
        }
    },


    deleteOne: {auth: {strategy: 'jwt',},
        handler: async function (request, h) {
            const feedback = await Feedback.deleteOne({ _id: request.params.id });
            if (feedback) {
                return { success: true };
            }
            return Boom.notFound('id not found');
        },
    },

    deleteAll: {auth: {strategy: 'jwt',},
        handler: async function(request, h) {
            await Feedback.deleteMany({});
            return { success: true };
        }
    }
};

module.exports = Feedbacks;
