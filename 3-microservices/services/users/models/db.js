'use strict';

const Mongoose = require('mongoose');

Mongoose.set('useNewUrlParser', true);
Mongoose.set('useUnifiedTopology', true);

Mongoose.connect('mongodb://localhost/Unison');
const db = Mongoose.connection;

db.on('disconnected', function() {
    console.log('database disconnected');
});

db.once('open', function() {
    console.log(`database connected to ${this.name} on ${this.host}`);
});
