const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles");
const verifyRoles = require("../../middleware/verifyRoles");
const {handleNewUser} = require("../../controllers/auth/registerController");
const { getUser, deleteUser, getUsers, updateUser} = require("../../controllers/users/usersController");
const verifyJWT= require("../../middleware/verifyJWT");

router.route("/")
    //get employees
    .get( getUsers)

   //update employee 
    .put(verifyJWT, verifyRoles(ROLES_LIST.User), updateUser)

    //add employee
    .post(verifyJWT,verifyRoles(ROLES_LIST.User),handleNewUser)

    //delete employee
    .delete(verifyJWT,verifyRoles(ROLES_LIST.User), deleteUser);

router.route("/user")
    .get(getUser);


module.exports =  router;