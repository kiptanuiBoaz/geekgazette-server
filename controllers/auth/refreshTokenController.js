const User = require("../../model/Users");// user schema
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
    const cookies = req?.cookies;
    console.log(req?.cookies)
    //check for cookies and jwt property
    if (!cookies?.jwt) return res.status(401).json({ "message": "cookie not found" });

    //access refresh token
    const refreshToken = cookies.jwt;

    res.clearCookie("jwt", { httpOnly: true, sameSite: "Lax", maxAge: 24 * 60 * 60 * 1000 }) //secureSite: true//delete the cookie

    //query the presensce of user with refresh token in db
    const foundUser = await User.findOne({ refreshToken }).exec(); //keys and values are the same

    //exit if user is not found
    if (!foundUser) {//detected re-used refresh token
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.status(403).json({ "message": err.message });
                const hackedUser = await User.findOne({ username: decoded.email }).exec();

                //empty the refreshTokens array
                hackedUser.refreshToken = [];
                const result = hackedUser.save();
            }
        )
        return res.status(403).json({ "message": "Forbidden!" });
    }

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
                .cookie("jwt", newRefreshToken, { httpOnly: true, sameSite: "Lax", maxAge: 24 * 60 * 60 * 1000 }) //secureSite: true
                .status(200)
                .json({ "message": `User ${foundUser.username} is logged in!`, accessToken, roles });
        }
    )

}

module.exports = { handleRefreshToken }; 