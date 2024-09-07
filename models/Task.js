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
        checked: {
            type: Boolean
        }
    }
)

module.exports = mongoose.model('Task', TaskSchema)