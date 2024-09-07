const mongoose = require('mongoose')

const Schema = mongoose.Schema

const GameSchema = Schema(
    {
        state: {
            type: String,
            required: true
        },
        automatictaskdistribution: {
            type: Schema.Types.Boolean
        }
    }
)

module.exports = mongoose.model('Game', GameSchema)