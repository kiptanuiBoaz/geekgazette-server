const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//employess schema
//use mogoose shcema constructor
const postSchema = new Schema({
    imgUrl: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,

    },
    category: {
        required: true,
        type: String,
    },
    body: {
        type: String,
        required: true,

    },
    userId: {
        type: String,
        required: true,
    },
    date: String,
    reactions: {
        thumbsUp: [], //array of uids
        wow: [],
        heart: [],
        rocket: [],
        coffee: []
    },
    comments: [{
        userId: String,
        date: String,
        text: String,
    },],
    likes: [{
        userId: String,
        date: String
    }]


})

//mongoDB sets collection names to plural lower case
module.exports = mongoose.model("Post", postSchema);