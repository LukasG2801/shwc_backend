const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TeamSchema = Schema(
    {
        teamname: {
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model('Team', TeamSchema)