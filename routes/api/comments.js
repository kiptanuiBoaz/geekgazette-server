const express = require("express");
const router = express.Router();
const { createNewComment, deleteComment } = require("../../controllers/posts/commentsController");

router.route("/")
    //new comments
    .post(createNewComment)

    //delete comment
    .delete(deleteComment)

module.exports = router;