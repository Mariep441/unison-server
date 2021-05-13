'use strict';

const User = require('../models/user');
const utils = require('./utils.js');
const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');          // ADDED
const saltRounds = 10;                     // ADDED

const Users = {

  find: {auth: {strategy: 'jwt',},
    handler: async function (request, h) {
      const users = await User.find();
      return users;
    },
  },


  findOne: {auth: {strategy: 'jwt',},
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ email: request.params.email });
        if (!user) {
          return Boom.notFound('No User with this email');
        }
        return user;
      } catch (err) {
        return Boom.notFound('No User with this email');
      }
    },
  },

  findOneAndUpdate: {auth: false,
    handler: async function(request, h) {
      try {
        const id = utils.getUserIdFromRequest(request);
      let UpdatedUser = new User(request.payload);
      const user = await User.findOneAndUpdate({ _id: request.params.id }, {$set: UpdatedUser}, {useFindAndModify: false});
      if (!user) {
        return Boom.notFound('No Task with this user');
      }
      return user;
    } catch (err) {
      return Boom.notFound('No Task with this user');
    }
   }
  },

  signup: {auth: false,
    handler: async function (request, h) {
      const payload = request.payload;
      let user = await User.findByEmail(payload.email);
      if (user) {
        const message = 'Email address is already registered';
        throw Boom.badData(message);
      }
      const hash = await bcrypt.hash(payload.password, saltRounds);    // ADDED

      const newUser = new User({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: hash                             // EDITED
      });
      user = await newUser.save();
      const token = utils.createToken(user);
      return h.response(user, {success: true, token: token}).code(201);
    },
  },

  signin: {auth: false,
    handler: async function (request, h) {
      const payload = request.payload;
      try {
        let user = await User.findByEmail(payload.email);
        if (!user) {
          return Boom.unauthorized('Email address is not registered');
        }
        if (!await user.comparePassword(payload.password)) {
          return Boom.unauthorized('Invalid password');
        } else {
          const token = utils.createToken(user);
          return h.response({ success: true, token: token }).code(201);
        }
      } catch (err) {
        return Boom.notFound('internal db failure');
      }
    },
  },


  deleteAll: {auth: {strategy: 'jwt',},
    handler: async function (request, h) {
      await User.deleteMany({});
      return { success: true };
    },
  },

  deleteOne: {auth: {strategy: 'jwt',},
    handler: async function (request, h) {
      const user = await User.deleteOne({ _id: request.params.id });
      if (user) {
        return { success: true };
      }
      return Boom.notFound('id not found');
    },
  },
};


module.exports = Users;
