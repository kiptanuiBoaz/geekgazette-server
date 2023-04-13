const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    fname:{
        type: String,
       
    },
    lname:{
        type: String,
       
    },
    headTag:{
        type: String,
     
    },
    email:{
        type: String,
        required: true,
    },
    avatarUrl:String,
    dob:{
        type:String,
      
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