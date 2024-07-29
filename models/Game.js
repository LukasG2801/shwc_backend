const mongoose = require('mongoose')

const Schema = mongoose.Schema

const GameSchema = Schema(
    {
        state: {
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model('Game', GameSchema)