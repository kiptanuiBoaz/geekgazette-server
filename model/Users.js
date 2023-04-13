const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    fname:{
        type: String,
        required: true,
    },
    lname:{
        type: String,
        required: true,
    },
    headTag:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    avatarUrl:String,
    dob:{
        type:String,
        required: true,
    },
    gender:String,
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