const User = require("../../model/Users");// user schema
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
    const cookies = req.cookies;
    // console.log({cookies})

    //destructure body params
    const { email, pwd } = req.body;

    //handle bad request
    if (!pwd || !email) return res.status(400).json({ "message": "Email and password are required" });

    //query the presensce of user
    const foundUser = await User.findOne({ email }).exec(); //exec is necessary bcoz its a mongoose method used with await without a callback
    //exit if user is not found
    if (!foundUser) return res.status(401).json({ "message": "user unauthorised!" });

    //evaluate  password
    const match = await bcrypt.compare(pwd, foundUser.password);

    if (match) {
        //acces the roles of the found user
        const roles = Object.values(foundUser.roles).filter(Boolean);
        //create access token
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "roles": roles,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
        )

        //create Refresh token
        const newRefreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "3d" }
        )

        //maintain the current rt in db if not in cookie
        let newRefreshTokenArray =
            !cookies?.jwt
                ? foundUser.refreshToken
                : foundUser.refreshToken.filter(rt => rt !== cookies.jwt)
            ;

        if (cookies?.jwt) {
            /*  
            Scenario  
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            // Detected refresh token reuse!
            if (!foundToken) {
                console.log('attempted refresh token reuse at login!')
                // clear out ALL previous refresh tokens
                newRefreshTokenArray = [];
            }

            res.clearCookie('jwt', { httpOnly: true, sameSite: "Lax", maxAge: 24 * 60 * 60 * 1000 }) //secureSite: true
        }

        //saving refresh token with found user
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();

        return res
            .cookie("jwt", newRefreshToken, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000,
                secure: true
            })

            .status(200)
            .json({ "message": `User ${email} is logged in!`, ...result, accessToken })

    } else {
        return res.status(401).json({ "message": "Password is incorrect" });
    }

}

module.exports = { handleLogin }; 