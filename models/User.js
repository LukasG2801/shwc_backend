const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = Schema(
    {
        username: {
            type: String,
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        role: {
            type: String
        },
        team : {
            type: mongoose.ObjectId
        },

        refresh_token: String
    }
)

module.exports = mongoose.model('User', UserSchema)

