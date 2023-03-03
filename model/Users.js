const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    roles:{
        User:{
            type: Number,
            default: 2001,  //assing default if not provided
        },
        Editor: Number,
        Admin: Number,
    },
    password:{
        type: String,
        required: true,

    },
    refreshToken: [String],//not required
    profileImage: String,//optional
})

module.exports = mongoose.model("User", userSchema);