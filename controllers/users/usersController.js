const User = require("../../model/Users"); //employee model
const ROLES_LIST = require("../../config/roles");
const bcrypt = require("bcrypt");

const createNewUser = async (req, res) => {
    //check for required fields
    if (!req?.body?.fname || !req?.body?.lname || !req?.body?.headTag || !req?.body?.dob) {
        return res.status(400).json({ "message": "First name, last name and date of birth are required" })
    }

    const foundUser = await User.findOne({ email }).exec();

    if (foundUser) return res.status(409).json({ "message": `User with email:${email} already exists` })

    try {
        const { email, pwd, newRoles, fname, lname, headTag, dob, gender, avatarUrl } = req.body;

        //create a new post record
        const result = await User.create({
            email,
            pwd,
            newRoles,
            fname,
            lname,
            headTag,
            dob,
            gender,
            avatarUrl
        })
        return res.status(201).json(result);

    } catch (error) {
        console.error(error)
    }

}

const getUsers = async (req, res) => {
    const users = await User.find();//returns all the users

    if (!users) {
        //handle emptydb
        return res.status(201).json({ "message": "No users found!" });
    } else {
        //success operation
        return res.status(200).json(users);
    }
}

const updateUser = async (req, res) => {
    if (req.body.email === "admin@gmail.com") return res.status(401).json({ "message": "Cannote edit Admin!" })
    //check if user is provided
    if (!req?.body?.email) return res.status(400).json({ "message": "email paramater is required" });

    //destrucure the data object
    const { email, pwd, newRoles, fname, lname, headTag, dob, gender, avatarUrl } = req.body;

    //grab the employee with the sent id from db
    const foundUser = await User.findOne({ email }).exec();

    //send !found when employee  doen't exist
    if (!foundUser) return res.status(204).json({ "message": `No users matches the email ${email}` });

    //handle roles
    if (newRoles) {
        newRoles.includes(ROLES_LIST.Admin) ?
            foundUser.roles = { ...ROLES_LIST } :
            foundUser.roles = { "Editor": 1984, "User": 2001 }
    } else {
        foundUser.roles = { "User": 2001 }
    }

    //handle password
    if (pwd) {
        try {
            //hash password
            const hashedPWD = await bcrypt.hash(pwd, 10);
            foundUser.password = hashedPWD;
        } catch (err) {
            console.error(err);
            return res.status(500).json({ "message": err.message });
        }
    }

    if (headTag) foundUser.headTag = headTag;
    if (lname) foundUser.lname = lname;
    if (fname) foundUser.fname = fname;
    if (dob) foundUser.dob = dob;
    if (gender) foundUser.gender = gender;
    if (avatarUrl) foundUser.avatarUrl = avatarUrl;

    //add updated user to db
    const result = await foundUser.save();

    //send a success response
    return res.status(200).json(result);
}

const deleteUser = async (req, res) => {
    if (req.body.email === "admin@gmail.com" || "admin") return res.status(401).json({ "message": "Cannote delete Admin!" })
    //check if user is provided
    if (!req?.body?.email) return res.status(400).json({ "message": "email paramater is required" });
    const { email } = req.body;
    //find the employee with `user`
    const foundUser = await User.findOne({ email }).exec();//needs exec

    //send !found when employee  doen't exist
    if (!foundUser) return res.status(204).json({ "message": `No user matches email ${email}` });

    //delete in db
    const result = await User.deleteOne({ email });
    //success message
    return res.status(200).json(result);
}

const getUser = async (req, res) => {
    if (!req?.query?.email) return res.status(400).json({ "message": "Email paramater is required" });
    
    //find the employee with id
    const foundUser = await User.findOne({ email: req.query.email }).lean().exec();

    //send !found when employee  doen't exist
    if (!foundUser) return res.status(204).json({ "message": `No user matches email ${req.query.email}` });
    return res.status(200).json(foundUser);
}

//export the fns
module.exports = {
    getUser,
    deleteUser,
    getUsers,
    updateUser,
    createNewUser,
}