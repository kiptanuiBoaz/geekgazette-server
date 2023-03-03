const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles");
const verifyRoles = require("../../middleware/verifyRoles");
const {handleNewUser} = require("../../controllers/registerController");
const { getUser, deleteUser, getUsers, updateUser} = require("../../controllers/usersController");

router.route("/")
    //get employees
    .get( verifyRoles(ROLES_LIST.Admin), getUsers)

   //update employee 
    .put( verifyRoles(ROLES_LIST.Admin), updateUser)

    //add employee
    .post(verifyRoles(ROLES_LIST.Admin),handleNewUser)

    //delete employee
    .delete(verifyRoles(ROLES_LIST.Admin), deleteUser);

router.route("/:user")
    .get( verifyRoles(ROLES_LIST.Admin),getUser);


module.exports =  router;