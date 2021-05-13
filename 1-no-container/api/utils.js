const jwt = require('jsonwebtoken');
const secret = require('../config');
const User = require('../models/user');

exports.createToken = function (user) {
    let scopes;
    // Check if the user object passed in has admin set to true, and if so, set scopes to admin
    if (user.admin) {
        scopes = 'admin';
    }
    return jwt.sign({ _id: user._id, email: user.email, scope: scopes }, secret, {
        algorithm: 'HS256',
        expiresIn: '1h',
    });
};

exports.decodeToken = function (token) {
    var userInfo = {};
    try {
        var decoded = jwt.verify(token, secret);
        userInfo.userId = decoded._id;
        userInfo.email = decoded.email;
    } catch (e) {}

    return userInfo;
};

exports.validate = async function (decoded, request) {
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
        return { isValid: false };
    } else {
        return { isValid: true };
    }
};

exports.getUserIdFromRequest = function(request) {
    var userId = null;
    try {
        const authorization = request.headers.authorization;
        var token = authorization.split(' ')[1];
        var decodedToken = jwt.verify(token, secret);
        userId = decodedToken._id;
    } catch (e) {
        userId = null;
    }
    return userId;
};
