const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles");
const verifyRoles = require("../../middleware/verifyRoles");
const {handleNewUser} = require("../../controllers/auth/registerController");
const { getUser, deleteUser, getUsers, updateUser} = require("../../controllers/users/usersController");

router.route("/")
    //get employees
    .get( verifyRoles(ROLES_LIST.User), getUsers)

   //update employee 
    .put( verifyRoles(ROLES_LIST.User), updateUser)

    //add employee
    .post(verifyRoles(ROLES_LIST.User),handleNewUser)

    //delete employee
    .delete(verifyRoles(ROLES_LIST.User), deleteUser);

router.route("/user")
    .get( verifyRoles(ROLES_LIST.User),getUser);


module.exports =  router;