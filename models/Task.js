const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TaskSchema = Schema(
    {
        title: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        team: {
            type: mongoose.ObjectId
        },
        status: {
            type: String
        }
    }
)

module.exports = mongoose.model('Task', TaskSchema)