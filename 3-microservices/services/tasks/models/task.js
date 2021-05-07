'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const taskSchema = new Schema({
    name: String,
    description: String,
    process:{type: Schema.Types.ObjectId, ref: 'Process'},
    priorityLevel: Number,
    criticalPath: Boolean,
    alert: Boolean,
    client:String,
    department:String,
    location: String,
    startDate: Date,
    deadline: Date,
    estimatedTimeToComplete: Number,
    timeSpent: Number,
    percentageOfCompletion:Number,
    dependencies:{type: Schema.Types.ObjectId, ref: 'Task'},
    nextStep:{type: Schema.Types.ObjectId, ref: 'Task'},
    creator:{type: Schema.Types.ObjectId, ref: 'User'},
    maker:{type: Schema.Types.ObjectId, ref: 'User'},
    checker: {type: Schema.Types.ObjectId, ref: 'User'},
    lastUpdate: Date,
    validated: Boolean
});

taskSchema.statics.findById = function(_id) {
    return this.findOne({ _id : _id});
};

taskSchema.statics.findAndUpdateById = function(_id, updatedTask) {
    return this.findOneAndUpdate({ _id : _id}, {$set: updatedTask}, {useFindAndModify: false});
};

taskSchema.statics.removeTask = function(_id) {
    return this.deleteOne({ _id : _id});
};

module.exports = Mongoose.model('Task', taskSchema);
