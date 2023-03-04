const express = require("express");
const router = express.Router();
const { updateReactions } = require("../../controllers/posts/reactionsController");

router.route("/")
    .put(updateReactions)

module.exports = router;