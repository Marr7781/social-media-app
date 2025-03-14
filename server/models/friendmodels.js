const mongoose = require('mongoose')

const FriendSchema = new mongoose.Schema({
    userId: String,
    friends: Array,
})

const FriendModel = mongoose.model("friends", FriendSchema)

module.exports = FriendModel