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
//add unique id variable for extra security

    });

const User = mongoose.model('User', UserSchema);

module.exports = User;