const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

exports.authenticated = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            throw true;
        }

        const token = authHeader.split(' ')[1]; // Bearer Token
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: decodeToken.user.userId });
        if(!user)
            throw true;

        req.userId = user.id;

        next();
    } catch (err) {
        const error = new Error('مجوز دسترسی ندارید');
        error.statusCode = 401;

        next(error);
    }
}