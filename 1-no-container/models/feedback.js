'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const feedbackSchema = Schema({
    comment: String,
    difficulty: String,
    communication: Number,
    computerLiteracy: Number,
    innovativeThinking: Number,
    leadership: Number,
    technicalKnowledge: Number,
    management: Number,
    task: {type: Schema.Types.ObjectId, ref: 'Task'},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
});

feedbackSchema.statics.findById = function(_id) {
    return this.findOne({ _id : _id});
};

feedbackSchema.statics.findByTask = function(task) {
    return this.find({ task : task});
};

module.exports = Mongoose.model('Feedback', feedbackSchema);


feedbackSchema.statics.findAndUpdateById = function(_id) {
    return this.findOneAndUpdate({ _id : _id}, {new: true});
};

feedbackSchema.statics.remove_review = function(_id) {
    return this.deleteOne({ _id : _id});
};


