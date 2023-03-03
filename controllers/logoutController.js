const User = require("../model/Users");// user schema

const handleLogout= async (req,res) => {
    //on client side also delete the access token
    //destructure cookies
    const cookies = req.cookies;
    // console.log(cookies)

    //check for cookies and jwt property
    if(!cookies?.jwt) return res.status(204).json({"message":"The cookie not found"});

    const refreshToken= cookies.jwt;

    //try to find refresh token in db
    const foundUser =  await User.findOne({refreshToken}).exec(); //keys and values are the same
    //erase cookie if user is not found
    if(!foundUser){
        //clear coockie
        res.clearCookie("jwt",  {httpOnly:true, sameSite:"None", maxAge: 24 * 60 * 60 * 1000});
        return res.status(204).json({"message":"Deleted but not in db!"});
    }

    //delete the user in the db
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    //save the changes to db
    const result = await foundUser.save();

    console.log(result);
    //clear coockie
    res.clearCookie("jwt",  {httpOnly:true, sameSite:"None", secure: true}); //secure:true only serves https
    return res.status(204).json({"message":"Logged out successfully"});  
    
   
}

module.exports = {handleLogout}; 