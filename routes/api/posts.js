const express = require("express");
const router = express.Router();
const postsController = require("../../controllers/posts/postsController");
const ROLES_LIST = require("../../config/roles");
const verifyRoles = require("../../middleware/verifyRoles");
const verifyJWT = require("../../middleware/verifyJWT");

const { getPosts, deletePost, getPost, updatePost, createNewPost } = postsController;

router.route("/")
    .get(getPosts)
    .post(verifyJWT, verifyRoles(ROLES_LIST.User), createNewPost)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.User), deletePost)
    .put(verifyJWT, verifyRoles(ROLES_LIST.User), updatePost);

router.route("/:id")
    .get(getPost);

module.exports = router;
