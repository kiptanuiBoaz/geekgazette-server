const bcrypt = require("bcrypt");
const User = require("../model/Users");// user schema


const handleNewUser = async (req, res) => {

    //destructure body params
    const { username, pwd, email, profileImage } = req.body;

    //handle bad request
    if (!pwd || !email) res.status(400).json({ "message": "Email and password are required" });

    //check for duplicate usernames in db
    const duplicate = await User.findOne({ email }).exec(); //exec is necessary bcoz its a mongoose method used with await without a callback

    if (duplicate) return res.status(409).json({ "message": "email already in use" });

    try {
        //hash password
        const hashedPWD = await bcrypt.hash(pwd, 10);

        //create and store (this also calls .save()) new user
        const newUser = await User.create({
            username,
            "password": hashedPWD,
            profileImage,
            email
        });

        return res.status(201).json({ "message": `New user ${newUser.username} created succesfully` })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ "message": err.message });
    }

}

module.exports = { handleNewUser }