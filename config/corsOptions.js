const whiteList = require("./whiteList")

const corsOptions = {
    credentials: true,
    "Access-Control-Allow-Credentials": true,
    origin: (origin, callback) =>{
        //check if origin is in the whitelist
        if(whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
           
        }else{
            callback(new Error("Not allowed by cors"));
        }

    },

    optionSuccessStatus: 200,
 

}

module.exports = corsOptions;