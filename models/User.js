const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true
        },

        first_name: {
            type: String, 
            required: true
        }, 

        last_name: {
            type: String, 
            required: true
        },

        password: {
            type: String,
            required: true 
        },

        refresh_token: String
    },
    {
        virtuals: {
            full_name: {
                get(){
                    return this.first_name + ' ' + this.last_name
                }
            },

            id: {
                get() {
                    return this._id
                }
            }
        }
    }
)

module.exports = mongoose.model('User', UserSchema)

