const whiteList = require("../config/whiteList");

const credentials = (req, res, next) => {
    const origin = req.headers.origin;

    // Check if origin is in the white list
    if (whiteList.includes(origin)) {
        // Set Access-Control-Allow-Origin header to the origin
        res.header("Access-Control-Allow-Origin", origin);
        // Set Access-Control-Allow-Credentials header to true
        res.header("Access-Control-Allow-Credentials", true);
    }

    next();
};

module.exports = credentials;