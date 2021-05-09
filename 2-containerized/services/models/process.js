'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const processSchema = Schema({
    name: String,
    client: String,
    frequency: String,
    startDate: Date,
    deadline: Date
});

processSchema.statics.findAndUpdateById = function(_id) {
    return this.findOneAndUpdate({ _id : _id}, {new: true});
};



module.exports = Mongoose.model('Process', processSchema);
