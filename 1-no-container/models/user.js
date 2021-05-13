'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    active: Boolean,
    admin: Boolean,
    communication: Number,
    computerLiteracy: Number,
    innovativeThinking: Number,
    leadership: Number,
    technicalKnowledge: Number,
    management: Number
});

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email });
};

userSchema.methods.comparePassword = async function(password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
};

module.exports = Mongoose.model('User', userSchema);
