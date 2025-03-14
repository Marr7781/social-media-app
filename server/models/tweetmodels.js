const mongoose = require('mongoose')

const TweetSchema = new mongoose.Schema({
    id: String,
    userName: String,
    content: String,
    like: {
        type: Number,
        default: 0,
    }
})

const TweetModel = mongoose.model("tweets", TweetSchema)

module.exports = TweetModel
