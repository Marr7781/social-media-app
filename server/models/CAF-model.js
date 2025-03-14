const mongoose = require('mongoose')

const CAFSchema = new mongoose.Schema({
    userName: String,
    content: String,
})

const CAFModel = mongoose.model("CAF", CAFSchema)

module.exports = CAFModel
