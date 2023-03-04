const express = require("express");
const router = express.Router();
const postsController = require("../../controllers/posts/postsController");
const ROLES_LIST = require("../../config/roles");
const verifyRoles = require("../../middleware/verifyRoles");


//from employees controoller
const { getPosts, deletePost, getPost, updatePost, createNewPost, } = postsController;

router.route("/")
    //get employees
    .get(getPosts)

    //update employee 
    .put(updatePost)

    //add employee
    .post( createNewPost)

    //delete employee
    .delete( deletePost);

router.route("/:id")
    .get(getPost);


module.exports = router;