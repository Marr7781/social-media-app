const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    commenterId: String,
    commenterUserName: String,
    content: String,
    tweetId: String,
})

const CommentModel = mongoose.model("comments", CommentSchema)

module.exports = CommentModel