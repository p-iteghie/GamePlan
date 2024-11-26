const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
    username: {
        type: String,
        required: true,
        unique: true
        },
    password: {
        type: String,
        required: true
        },
    calendar: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
        }],
    friends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    friendReqs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
//add unique id variable for extra security

    });

const User = mongoose.model('User', UserSchema);

module.exports = User;