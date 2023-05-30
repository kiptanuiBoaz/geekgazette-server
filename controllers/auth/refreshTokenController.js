const User = require("../../model/Users");// user schema
const jwt = require("jsonwebtoken");
const cookieOptions = require("../../config/cookieOptions");

const handleRefreshToken = async (req, res) => {
    const cookies = req?.cookies;
    console.log(req?.cookies)
    //check for cookies and jwt property
    if (!cookies?.jwt) return res.status(401).json({ "message": "cookie not found" });

    //access refresh token
    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", cookieOptions); //secureSite: true//delete the cookie

    //query the presensce of user with refresh token in db
    const foundUser = await User.findOne({ refreshToken: { $in: [refreshToken] } }).exec();

    // Exit if user is not found or detected re-used refresh token
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ "message": err.message });
                } else {
                    try {
                        const hackedUser = await User.findOne({ email: decoded.email }).exec();

                        if (hackedUser) {
                            hackedUser.refreshToken = [];
                            const result = await hackedUser.save();

                            return res.status(403).json({ "message": "Forbidden!" }, result);
                        } else {
                            return res.status(403).json({ "message": "User not found!" });
                        }
                    } catch (e) {
                        // Handle any error that occurred during the database operation
                        return res.status(500).json({ "message": "Internal Server Error" }, e.message);
                    }
                }
            }
        );
    }

    console.log(foundUser)
    //remove used refreshtoken from db
    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    //evaluate  jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
            }
            //id recieved name is !== name in DB
            if (err || decoded.email !== foundUser.email)
                return res.status(403).json({ "message": `${err.message}` });

            //refresh Token still valid
            //roles of user from DB
            const roles = Object.values(foundUser.roles)
            //generate a new access token
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.email,
                        "roles": roles,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1d" }
            );

            //create NewRefresh token
            const newRefreshToken = jwt.sign(
                { "username": foundUser.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "2d" }
            )

            //saving refresh token with found user
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();


            return res
                .cookie("jwt", JSON.stringify(newRefreshToken), cookieOptions)
                .status(200)
                .json({ "message": `User ${foundUser.username} is logged in!`, accessToken, foundUser });
        }
    )

}

module.exports = { handleRefreshToken }; 