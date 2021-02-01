'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;


const taskSchema = new Schema({
    name: String,
    description: String,
    priorityLevel: Number,
    client: {
        type: String,
        enum:['Client1', 'Client2', 'Client3', 'all']
    },
    skills: {
        accounting: Boolean,
        transferAgency: Boolean,
        corporateSecretarial: Boolean,
        administrative: Boolean,
        seniorManagement: Boolean,
        it: Boolean
    },
    timeToComplete: Number,
    dependencies:{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    },
    nextStep:{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    },
    maker:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    checker: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

taskSchema.statics.findById = function(_id) {
    return this.findOne({ _id : _id});
};

taskSchema.statics.findAndUpdateById = function(_id) {
    return this.findOneAndUpdate({ _id : _id}, {new: true});
};

taskSchema.statics.removeTask = function(_id) {
    return this.deleteOne({ _id : _id});
};

module.exports = Mongoose.model('Task', taskSchema);
