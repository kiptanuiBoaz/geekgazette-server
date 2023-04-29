const express = require("express");
const router = express.Router();
const postsController = require("../../controllers/posts/postsController");
const ROLES_LIST = require("../../config/roles");
const verifyRoles = require("../../middleware/verifyRoles");
const verifyJWT = require("../../middleware/verifyJWT");

const { getPosts, deletePost, getPost, updatePost, createNewPost } = postsController;

router.route("/")
    .get( getPosts)
    .post( verifyRoles(ROLES_LIST.User), verifyJWT,createNewPost)
    .delete( verifyRoles(ROLES_LIST.User), verifyJWT, deletePost)
    .put( verifyRoles(ROLES_LIST.User), verifyJWT, updatePost);

router.route("/:id")
    .get(getPost);

module.exports = router;
