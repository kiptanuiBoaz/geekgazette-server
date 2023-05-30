const User = require("../../model/Users");// user schema
const cookieOptions = require("../../config/cookieOptions");

const handleLogout = async (req, res) => {
    //on client side also delete the access token
    //destructure cookies
    const cookies = req.cookies;

    //check for cookies and jwt property
    if (!cookies?.jwt) return res.status(204).json({ "message": "The cookie not found" });

    const refreshToken = cookies.jwt;
    try {
        //try to find refresh token in db
        const foundUser = await User.findOne({ refreshToken }).exec(); //keys and values are the same

        //erase cookie if user is not found
        if (!foundUser) {
            //clear coockie
            console.log("not found")
            res.clearCookie("jwt", cookieOptions);
            return res.status(204).json({ "message": "Deleted but not in db!" });
        } else {
            console.log(" found")
            //delete the user in the db
            foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
            //save the changes to db
            const result = await foundUser.save();

            //clear coockie
            res.clearCookie("jwt", cookieOptions); //secure:true only serves https
            return res.status(204).json({ "message": "Logged out successfully" });

        }
    } catch (e) {
        console.error(e)
    }

}

module.exports = { handleLogout }; 