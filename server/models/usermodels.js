const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    gender: {type: Boolean, default: true}
})

const UserModel = mongoose.model("users", UserSchema)

module.exports = UserModel