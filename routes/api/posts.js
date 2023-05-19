const express = require("express");
const router = express.Router();
const postsController = require("../../controllers/posts/postsController");
const ROLES_LIST = require("../../config/roles");
const verifyRoles = require("../../middleware/verifyRoles");
const verifyJwt = require("../../middleware/verifyJwt");

const { getPosts, deletePost, getPost, updatePost, createNewPost } = postsController;

router.route("/")
    .get(getPosts)
    .post(verifyJwt, verifyRoles(ROLES_LIST.User), createNewPost)
    .delete(verifyJwt, verifyRoles(ROLES_LIST.User), deletePost)
    .put(verifyJwt, verifyRoles(ROLES_LIST.User), updatePost);

router.route("/:id")
    .get(getPost);

module.exports = router;
