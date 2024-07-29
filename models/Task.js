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
        }
    }
)

module.exports = mongoose.model('Task', TaskSchema)